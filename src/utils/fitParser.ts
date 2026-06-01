export function extractStats(fitData: any) {
    const session = fitData.sessions?.[0];

    if (!session) return null;

    const distance = session.total_distance ?? 0;
    const durationSec = session.total_timer_time || session.total_elapsed_time || 0;
    const avgHr = session.avg_heart_rate || 0;
    const paceMinPerMi = distance > 0 ? durationSec / 60 / distance : 0;

    // Getting the date from session start_time
    const startTime = session.start_time ? new Date(session.start_time) : null;
    const workoutDate = startTime
        ? startTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        : null;

    return {
        distance,
        durationSec,
        avgHr,
        paceMinPerMi,
        workoutDate,
    };
}

