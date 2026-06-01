import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

type Props = {
    records: any[];
};

export default function Charts({ records }: Props) {
    const sampled = records.filter((_, i) => i % 10 === 0);

    const startTime = sampled[0]?.timestamp
        ? new Date(sampled[0].timestamp).getTime()
        : null;

    const labels = sampled.map((r) => {
        if (!r.timestamp || !startTime) return "";
        const elapsedSec = (new Date(r.timestamp).getTime() - startTime) / 1000;
        const m = Math.floor(elapsedSec / 60);
        const s = Math.floor(elapsedSec % 60);
        return `${m}:${String(s).padStart(2, "0")}`;
    });

    const heartRates = sampled.map((r) =>
        typeof r.heart_rate === "number" && r.heart_rate > 0 ? r.heart_rate : null
    );

    const paces = sampled.map((r) => {
    if (!r.speed || r.speed <= 0.1) return null; // Avoiding dividing by near-zero
    return 60 / r.speed;
    });


    const sharedOptions = {
        plugins: {
            legend: { labels: { font: { size: 14 } } },
        },
        scales: {
            x: {
                ticks: { font: { size: 12 }, maxTicksLimit: 10 },
                title: { display: true, text: "Elapsed time", font: { size: 13 } },
            },
        },
    };

    const hrData = {
        labels,
        datasets: [{
            label: "Heart Rate (bpm)",
            data: heartRates,
            borderColor: "#e74c3c",
            backgroundColor: "rgba(231,76,60,0.1)",
            pointRadius: 0,
            tension: 0.3,
            spanGaps: true,
        }],
    };

    const hrOptions = {
        ...sharedOptions,
        scales: {
            ...sharedOptions.scales,
            y: {
                ticks: { font: { size: 12 } },
                title: { display: true, text: "BPM", font: { size: 13 } },
            },
        },
    };

    const paceData = {
        labels,
        datasets: [{
            label: "Pace (min/mi)",
            data: paces,
            borderColor: "#3498db",
            backgroundColor: "rgba(52,152,219,0.1)",
            pointRadius: 0,
            tension: 0.3,
            spanGaps: true,
        }],
    };

    const paceOptions = {
        ...sharedOptions,
        scales: {
            ...sharedOptions.scales,
            y: {
                reverse: true,
                ticks: {
                    stepSize: 0.5,
                    font: { size: 12 },
                    callback: (value: any) => {
                        const min = Math.floor(value);
                        const sec = Math.round((value - min) * 60);
                        return `${min}:${String(sec).padStart(2, "0")}`;
                    },
                },
                title: { display: true, text: "min/mi", font: { size: 13 } },
            },
        },
    };

    return (
        <div style={{
            width:"100%",
            maxWidth:"1000px",
            background: "#03003837",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
            <div style={{ marginBottom: "40px" }}>
                <h2 style={{ marginBottom: "16px" }}>Heart Rate Over Time</h2>
                <div style={{ height: "280px", width:"100%" }}>
                    <Line data={hrData} options={{ ...hrOptions, maintainAspectRatio: false }} />
                </div>
            </div>
            <div>
                <h2 style={{ marginBottom: "16px" }}>Pace Over Time</h2>
                <div style={{ height: "280px", width:"100%" }}>
                    <Line data={paceData} options={{ ...paceOptions, maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
}

