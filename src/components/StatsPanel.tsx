type Props = {
    stats: any;
};

function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
}

function formatPace(pace: number) {
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

const statBox: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
};

const label: React.CSSProperties = {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    opacity: 0.6,
};

const value: React.CSSProperties = {
    fontSize: "22px",
    fontWeight: 600,
};

export default function StatsPanel({ stats }: Props) {
    return (
        <div style={{
            background: "rgba(3, 0, 38, 0.23)",
            color: "rgba(255, 255, 255, 0.85)",
            padding: "24px 28px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
            {/* Date header */}
            {stats.workoutDate && (
                <div style={{
                    fontSize: "13px",
                    opacity: 0.55,
                    marginBottom: "14px",
                    letterSpacing: "0.04em",
                }}>
                    {stats.workoutDate}
                </div>
            )}

            <h2 style={{ margin: "0 0 18px 0", fontSize: "30px", fontWeight: 600 }}>
                Workout Summary
            </h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "24px",
            }}>
                <div style={statBox}>
                    <span style={label}>Distance</span>
                    <span style={value}>{stats.distance.toFixed(2)}</span>
                    <span style={{ opacity: 0.5, fontSize: "13px" }}>miles</span>
                </div>

                <div style={statBox}>
                    <span style={label}>Duration</span>
                    <span style={value}>{formatTime(stats.durationSec)}</span>
                    <span style={{ opacity: 0.5, fontSize: "13px" }}>active time</span>
                </div>

                <div style={statBox}>
                    <span style={label}>Avg Heart Rate</span>
                    <span style={value}>{stats.avgHr}</span>
                    <span style={{ opacity: 0.5, fontSize: "13px" }}>bpm</span>
                </div>

                <div style={statBox}>
                    <span style={label}>Avg Pace</span>
                    <span style={value}>{formatPace(stats.paceMinPerMi)}</span>
                    <span style={{ opacity: 0.5, fontSize: "13px" }}>per mile</span>
                </div>
            </div>
        </div>
    );
}

