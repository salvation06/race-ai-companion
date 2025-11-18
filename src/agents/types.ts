export interface CarSnapshot {
  carNumber: string;
  position: number;
  driver: string;
  team: string;
  lapsCompleted: number;
  totalTime: string;
  gapToFirstSec: number | null;
  gapToPrevSec: number | null;
  bestLapTimeSec: number;
  lastLapTimeSec: number;
  avgLapTimeSec: number;
  regressionMeanSec: number;
  regressionZScore: number;
  heroLapFlag: boolean;
  fallingBackFlag: boolean;
  speedKphBest: number;
  class: string;
  vehicle: string;
  currentLap: number;
  speed: number;
  lastLapTime: string;
  gapToLeader: string;
  progress: number;
}

export interface WeatherSnapshot {
  airTempC: number;
  trackTempC: number;
  humidityPct: number;
  windSpeedKph: number;
  windDirectionDeg: number;
  conditions: "Sunny" | "Cloudy" | "Wet" | "Mixed";
}

export interface AgentAnalysis {
  paceAnalysis?: any;
  weatherAnalysis?: any;
  engineTire?: any;
  driverState?: any;
  leadChase?: any;
  llmInsight?: any;
}
