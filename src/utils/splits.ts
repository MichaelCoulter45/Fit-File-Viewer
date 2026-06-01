const MILES_PER_SPLIT = 1;
const PAUSE_GAP_MS = 3000;

export function computeSplits(records: any[]) {
    const splits: any[] = [];

    const filtered = records.filter(
        (r) => typeof r.distance === "number" && r.distance > 0
    );

    let nextSplit = MILES_PER_SPLIT;
    let startTime: any = null;
    let pausedMs = 0;
    let lastTimestamp: any = null;

    // Adding metrics per split
    let hrValues: number[] = [];
    let cadenceValues: number[] = [];
    let powerValues: number[] = [];
    let strideLengthValues: number[] = [];

    const pushSplit = (timeSec: number, distanceMi: number, isPartial: boolean) => {
        const avg = (arr: number[]) =>
            arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

        const avgCadenceRaw = avg(cadenceValues);

        splits.push({
            splitNumber: splits.length + 1,
            pace: distanceMi > 0 ? timeSec / 60 / distanceMi : 0,
            time: timeSec,
            distanceMi,
            isPartial,
            avgHr: avg(hrValues) !== null ? Math.round(avg(hrValues)!) : null,
            // cadence
            avgCadence: avgCadenceRaw !== null ? Math.round(avgCadenceRaw * 2) : null,
            avgPower: avg(powerValues) !== null ? Math.round(avg(powerValues)!) : null,
            // stride length 
            avgStrideLength: avg(strideLengthValues) !== null
                ? ((avg(strideLengthValues)! * 0.0393701) / 12).toFixed(2)
                : null,
        });
    };

    for (const r of filtered) {
        if (!startTime) {
            startTime = r.timestamp;
            lastTimestamp = r.timestamp;
        }

        // Detect pause by time gap
        if (lastTimestamp) {
            const gapMs =
                new Date(r.timestamp).getTime() - new Date(lastTimestamp).getTime();
            if (gapMs > PAUSE_GAP_MS) {
                pausedMs += gapMs;
            }
        }
        lastTimestamp = r.timestamp;

        // Accumulate metrics (only for active records)
        const gapMs = lastTimestamp
            ? new Date(r.timestamp).getTime() - new Date(lastTimestamp).getTime()
            : 0;
        const isActive = gapMs <= PAUSE_GAP_MS;

        if (isActive) {
            if (typeof r.heart_rate === "number" && r.heart_rate > 0)
                hrValues.push(r.heart_rate);
            if (typeof r.cadence === "number" && r.cadence > 0)
                cadenceValues.push(r.cadence);
            if (typeof r.power === "number" && r.power > 0)
                powerValues.push(r.power);
            if (typeof r.step_length === "number" && r.step_length > 0)
                strideLengthValues.push(r.step_length);
        }

        if (r.distance >= nextSplit) {
            const totalMs =
                new Date(r.timestamp).getTime() - new Date(startTime).getTime();
            const activeMs = Math.max(totalMs - pausedMs, 0);
            const timeSec = activeMs / 1000;

            pushSplit(timeSec, 1, false);

            // Reset for next split
            startTime = r.timestamp;
            lastTimestamp = r.timestamp;
            pausedMs = 0;
            nextSplit += MILES_PER_SPLIT;
            hrValues = [];
            cadenceValues = [];
            powerValues = [];
            strideLengthValues = [];
        }
    }

    // Partial final split
    const lastRecord = filtered[filtered.length - 1];
    if (startTime && lastRecord) {
        const completedMiles = splits.length;
        const remainingMi = lastRecord.distance - completedMiles * MILES_PER_SPLIT;

        if (remainingMi > 0.01) {
            const totalMs =
                new Date(lastRecord.timestamp).getTime() -
                new Date(startTime).getTime();
            const activeMs = Math.max(totalMs - pausedMs, 0);
            const timeSec = activeMs / 1000;

            pushSplit(timeSec, remainingMi, true);
        }
    }

    return splits;
}

