import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { CarTelemetryCard } from "@/components/CarTelemetryCard";
import { parseRaceData, generateLiveRaceData } from "@/utils/raceDataParser";
import { Navigation } from "@/components/Navigation";
import { CrewChiefDialog } from "@/components/CrewChiefDialog";
import raceDataCSV from "@/data/race-results.csv?raw";
import trackMap from "@/assets/indy-track.jpg";
import { PaceRegressionAgent } from "@/agents/paceRegressionAgent";
import { WeatherAgent } from "@/agents/weatherAgent";
import { EngineTireAgent } from "@/agents/engineTireAgent";
import { LeadChaseAgent } from "@/agents/leadChaseAgent";
import { DriverStateAgent } from "@/agents/driverStateAgent";
import { supabase } from "@/integrations/supabase/client";

export default function HeartBeat() {
  const [currentLap, setCurrentLap] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [raceDrivers, setRaceDrivers] = useState<any[]>([]);
  const [liveData, setLiveData] = useState<any[]>([]);
  
  // Initialize agents
  const [agents] = useState(() => ({
    paceRegression: new PaceRegressionAgent(),
    weather: new WeatherAgent(),
    engineTire: new EngineTireAgent(),
    leadChase: new LeadChaseAgent(),
    driverState: new DriverStateAgent()
  }));
  
  // Simulated weather data
  const [weatherData] = useState({
    airTempC: 24.3,
    trackTempC: 32.1,
    humidityPct: 55,
    windSpeedKph: 9,
    windDirectionDeg: 210,
    conditions: "Sunny" as const
  });

  useEffect(() => {
    const drivers = parseRaceData(raceDataCSV);
    setRaceDrivers(drivers.slice(0, 10)); // Show top 10
  }, []);

  useEffect(() => {
    if (raceDrivers.length > 0) {
      const live = raceDrivers.map(driver => {
        const carData = generateLiveRaceData(driver, currentLap, 26);
        
        // Run agents on each car
        const paceAnalysis = agents.paceRegression.analyzePace(carData, []);
        const weatherAnalysis = agents.weather.analyzeWeather(weatherData);
        const engineTire = agents.engineTire.estimateHealth(carData, weatherData);
        const driverState = agents.driverState.analyzeDriverState(carData, paceAnalysis);
        
        // Lead chase analysis for cars within 10s of leader
        const leaderCar = raceDrivers[0];
        const leaderData = leaderCar ? generateLiveRaceData(leaderCar, currentLap, 26) : null;
        const leadChase = leaderData && carData.position > 1 && carData.gapToFirstSec && carData.gapToFirstSec < 10
          ? agents.leadChase.calculateCatchUp(carData, leaderData, 26 - currentLap)
          : null;
        
        return {
          ...carData,
          analysis: {
            paceAnalysis,
            weatherAnalysis,
            engineTire,
            driverState,
            leadChase
          }
        };
      });
      setLiveData(live);
    }
  }, [currentLap, raceDrivers, agents, weatherData]);

  useEffect(() => {
    if (!isRunning || currentLap >= 26) {
      if (currentLap >= 26) setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentLap(prev => Math.min(prev + 1, 26));
    }, 3000); // Advance lap every 3 seconds

    return () => clearInterval(interval);
  }, [isRunning, currentLap]);

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setCurrentLap(1);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Navigation />
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                X-RaceIQ <span className="text-racing-red">HeartBeat</span>
              </h1>
              <p className="text-muted-foreground">Live Race Telemetry Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <CrewChiefDialog carContext={liveData[0]} />
              <Button
                onClick={handlePlayPause}
                size="lg"
                variant={isRunning ? "destructive" : "default"}
              >
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start
                  </>
                )}
              </Button>
              <Button onClick={handleReset} size="lg" variant="outline">
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Race Info */}
        <div className="mb-8 p-6 bg-card/50 backdrop-blur rounded-lg border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Lap</p>
              <p className="text-4xl font-bold text-racing-red">{currentLap} / 26</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Track</p>
              <p className="text-2xl font-bold text-foreground">Indianapolis Motor Speedway</p>
              <p className="text-sm text-muted-foreground">Road Course Configuration</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Series</p>
              <p className="text-2xl font-bold text-foreground">Toyota GR Cup</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className={`text-2xl font-bold ${isRunning ? 'text-racing-red animate-pulse' : 'text-muted-foreground'}`}>
                {isRunning ? 'LIVE' : 'PAUSED'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Track Map */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-card/50 backdrop-blur rounded-lg border border-border/50 p-4">
                <h2 className="text-xl font-bold mb-4 text-foreground">Track Layout</h2>
                <img 
                  src={trackMap} 
                  alt="Indianapolis Motor Speedway Road Course"
                  className="w-full rounded-lg shadow-racing"
                />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Turns:</span>
                    <span className="font-semibold text-foreground">14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sectors:</span>
                    <span className="font-semibold text-foreground">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DRS Zones:</span>
                    <span className="font-semibold text-foreground">Main Straight</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Telemetry */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Live Telemetry <span className="text-muted-foreground text-lg">(Top 10)</span>
            </h2>
            <div className="space-y-4">
              {liveData.map((data) => (
                <CarTelemetryCard key={data.carNumber} {...data} />
              ))}
            </div>
          </div>
        </div>

        {/* AI Integration Notice */}
        <div className="mt-8 p-6 bg-accent/10 border border-accent rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-foreground">🤖 AI Crew Chief Integration - LIVE</h3>
          <p className="text-muted-foreground mb-2">
            Click "Get AI Analysis" on any car to receive real-time strategic recommendations powered by Lovable AI.
            Multi-agent system analyzing: Pace Regression, Weather Conditions, Engine/Tire Health, Driver State, and Chase Strategy.
          </p>
          <div className="flex gap-2 mt-3">
            <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">google/gemini-2.5-flash</code>
            <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">Agent2Agent System</code>
          </div>
        </div>
      </div>
    </div>
  );
}
