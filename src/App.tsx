import { useState } from "react";
import UploadBox from "./components/UploadBox.tsx";
import FitParser from "fit-file-parser";
import { extractStats } from "./utils/fitParser.ts";
import StatsPanel from "./components/StatsPanel";
import Charts from "./components/Charts";
import MapView from "./components/MapView";
import { computeSplits } from "./utils/splits";
import SplitsTable from "./components/SplitsTable";
import { computeInsights } from "./utils/insights";
import SummaryCard from "./components/SummaryCard";

export default function App() {
  const [data, setData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [splits, setSplits] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const handleFileLoaded = (buffer: ArrayBuffer) => {
    const parser = new FitParser({
      force: true,
      speedUnit: "mph",
      lengthUnit: "mi",
    });

    parser.parse(buffer, (error: any, result: any) => {
      if (error) {
        console.error(error);
        return;
      }

      const computedSplits = computeSplits(result.records || []);
      setData(result);
      setStats(extractStats(result));
      setSplits(computedSplits);
      setInsights(computeInsights(result.records || [], computedSplits));
    });
  };

  const hasData = !!stats;

  return (
    <div style={{
      minHeight: "100vh",
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "24px",
      fontFamily: "Arial, sans-serif",
      boxSizing: "border-box",
    }}>

      {/* Header */}
      <h1 style={{ marginBottom: "6px", fontSize: "2rem" }}>.FIT File Analyzer</h1>
      <p style={{ color: "#888", marginBottom: "20px" }}>
        Upload your workout and analyze performance
      </p>

      {/* Upload row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}>
        <UploadBox onFileLoaded={handleFileLoaded} />
        
      </div>

      {hasData && (
        <>
          {/* Row 1: Stats bar */}
          {stats && <StatsPanel stats={stats} />}

          {/* Row 2: Map */}
          {data?.records?.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <MapView records={data.records} />
            </div>
          )}

          {/* Row 3: Charts */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "24px",
            marginTop: "24px",
            alignItems: "start",
          }}>
            {data?.records && <Charts records={data.records} />}
          </div>
          <div>
            {insights && <SummaryCard insights={insights} />}
          </div>

          {/* Row 4: Splits table */}
          {splits.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <SplitsTable splits={splits} />
            </div>
          )}
        </>
      )}
    </div>
  );
}



/* 
Future Goals:
- Splits Table add the header to the very last row for easy reference for long runs.
- Make start and end points on the map more obvious.
- Ability to hide some of the start and end distances for privacy.
- Make a visual of how the run went on the map: marker progresses through the run and changes color based on HR zone, or pacing zones.
- Add calendar as main component. - Maybe each day has it's own folder and notes can be stored there.
- Add weather for each of those days with a weather fetching service.
- Be able to add a training plan for x amount of days. ex: Every tuesday / thursday is a workout day. And what types of workouts.
- Calculate fitness scores of the user, like general running fitness, threshold pace/HR
- Calculate race predictions, like how fast can the user run 5k, 10k, ½, and full marathons given their threshold data.
- Additional analytics metrics. Like, VO2 max, fatigue, injury risk.
- Auto grab data from COROS, Strava, Garmin, etc..
- Read folder full of .fit files and assign each of them to a date.
- Compare two or more runs.
- find direction of lap.
- determine pacing insights - slow down due to wind? elevation? fueling? fatigue? 
- Incorporate AI to analyze workouts for each day and make notes for each day.
- Make this have a user login and incorporate a database.
- Add weight management system. Weekly/daily lbs, cals intake/output, etc
- Add strength training.
- Add strength training styles. Hyrox, high reps, cross fit, weight resistance training, etc.
- Add training plan presets. Running: Nike marathon plans, couch to 5k, etc
- Add strength training plan presents: Upper/Lower, Push-Pull-Legs, etc.
- Add workout equipment on hand / available
- Add shoe mileage tracker
- Add shore mileage warning after x amount of miles.
- Add weather warnings - High sun exposure, High humidity/dew point, dangerous weather, etc.\
- Upload csv file to add workouts, calorie info, equipment, etc.
*/