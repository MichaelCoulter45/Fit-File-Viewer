import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

type Props = {
    records: any[];
};

export default function MapView({ records }: Props) {
    const positions = records
        .filter(
            (r) =>
                typeof r.position_lat === "number" &&
                typeof r.position_long === "number"
        )
        .map((r) => [r.position_lat, r.position_long] as [number, number]);

    const start = positions[0];
    const end = positions[positions.length - 1];

    if (positions.length === 0) {
        return <p>No GPS data available</p>;
    }

    return (
        <div style={{
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}>
            <h2 style={{ margin: "0 0 12px 0" }}>Route Map</h2>
            <MapContainer
                bounds={positions}
                style={{ height: "480px", width: "100%", borderRadius: "10px" }}
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={positions} pathOptions={{ color: "#3498db", weight: 3 }} />
                <Marker position={start}>
                    <Popup>Start</Popup>
                </Marker>
                <Marker position={end}>
                    <Popup>Finish</Popup>
                </Marker>
                <FitBounds positions={positions} />
            </MapContainer>
        </div>
    );
}

function FitBounds({ positions }: { positions: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (!positions.length) return;
        map.fitBounds(positions);
    }, [positions]);
    return null;
}

