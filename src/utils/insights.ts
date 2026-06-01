export function computeInsights(records: any[], splits: any[]) {
    if (!records?.length) return null;

    const fastestSplit = splits.length
        ? splits.reduce((min, s) => (s.pace < min.pace ? s : min))
        : null;

    const slowestSplit = splits.length
        ? splits.reduce((max, s) => (s.pace > max.pace ? s : max))
        : null;

    const hrValues = records
        .map((r) => r.heart_rate)
        .filter((v) => typeof v === "number" && v > 0);

    const avgHr =
        hrValues.length > 0
            ? Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length)
            : null;

    const lastRecordWithDistance = [...records]
        .reverse()
        .find((r) => typeof r.distance === "number" && r.distance > 0);

    const distance: number = lastRecordWithDistance?.distance ?? 0;

    return {
        fastestSplit,
        slowestSplit,
        avgHr,
        distance,
    };
}

