type Props = {
    splits: any[];
};

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatPace(pace: number) {
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}:${sec.toString().padStart(2, "0")} /mi`;
}

const th: React.CSSProperties = {
    padding: "10px 14px",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "13px",
    whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: "14px",
    whiteSpace: "nowrap",
};

export default function SplitsTable({ splits }: Props) {
    return (
        <div style={{ marginTop: 30 }}>
            <h2>Lap Details</h2>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                    <thead style={{ background: "rgba(3, 0, 38, 0.30)" }}>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
                            <th style={th}>#</th>
                            <th style={th}>Dist</th>
                            <th style={th}>Time</th>
                            <th style={th}>Pace</th>
                            <th style={th}>Avg HR</th>
                            <th style={th}>Cadence</th>
                            <th style={th}>Power</th>
                            <th style={th}>Stride</th>
                        </tr>
                    </thead>
                    <tbody>
                        {splits.map((s, i) => (
                            <tr
                                key={s.splitNumber}
                                style={{
                                    background: i % 2 === 0
                                        ? "rgba(3, 0, 38, 0.10)"
                                        : "rgba(3, 0, 38, 0.18)",
                                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                                    fontStyle: s.isPartial ? "italic" : "normal",
                                    opacity: s.isPartial ? 0.8 : 1,
                                }}
                            >
                                <td style={td}>{s.splitNumber}</td>
                                <td style={td}>{s.isPartial ? `${s.distanceMi.toFixed(2)} mi` : "1.00 mi"}</td>
                                <td style={td}>{formatTime(s.time)}</td>
                                <td style={td}>{formatPace(s.pace)}</td>
                                <td style={td}>{s.avgHr ?? "—"} {s.avgHr ? "bpm" : ""}</td>
                                <td style={td}>{s.avgCadence ?? "—"} {s.avgCadence ? "" : ""}</td>
                                <td style={td}>{s.avgPower ?? "—"} {s.avgPower ? "W" : ""}</td>
                                <td style={td}>{s.avgStrideLength ?? "—"} {s.avgStrideLength ? "ft" : ""}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

