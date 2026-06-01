type Props = {
    insights: any;
};

function formatPace(pace: number) {
    const min = Math.floor(pace);
    const sec = Math.round((pace - min) * 60);
    return `${min}:${sec.toString().padStart(2, "0")} /mi`;
}

export default function SummaryCard({ insights }: Props) {
    if (!insights) return null;

    return (
        <div
            style={{
                background: "#ffffff00",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                marginTop: "20px",
            }}
        >
            <h2 style={{ marginBottom: "10px" }}>Workout Insights</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                    <strong>Avg HR</strong>
                    <div>{insights.avgHr ?? "N/A"} bpm</div>
                </div>

                <div>
                    <strong>Distance</strong>
                    {/* Guard for toFixed distance could be undefined if no records had distance */}
                    <div>{(insights.distance ?? 0).toFixed(2)} mi</div>
                </div>

                <div>
                    <strong>Fastest Split</strong>
                    <div>
                        {insights.fastestSplit
                            ? formatPace(insights.fastestSplit.pace)
                            : "N/A"}
                    </div>
                </div>

                <div>
                    <strong>Slowest Split</strong>
                    <div>
                        {insights.slowestSplit
                            ? formatPace(insights.slowestSplit.pace)
                            : "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );
}

