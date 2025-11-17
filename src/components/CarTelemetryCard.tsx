import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gauge, TrendingUp, Trophy, Clock } from "lucide-react";
import { mockAIAnalyze, AIRaceAnalysis } from "@/services/mockAIService";

interface CarTelemetryCardProps {
  carNumber: string;
  driverName: string;
  position: number;
  currentLap: number;
  speed: number;
  lastLapTime: string;
  gapToLeader: string;
  team: string;
  progress: number;
}

export const CarTelemetryCard = ({
  carNumber,
  driverName,
  position,
  currentLap,
  speed,
  lastLapTime,
  gapToLeader,
  team,
  progress
}: CarTelemetryCardProps) => {
  const [aiAnalysis, setAiAnalysis] = useState<AIRaceAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAIAnalysis = async () => {
    setLoading(true);
    const analysis = await mockAIAnalyze({
      carNumber,
      driverName,
      position,
      currentLap,
      speed,
      lastLapTime,
      gapToLeader
    });
    setAiAnalysis(analysis);
    setLoading(false);
  };

  const getPositionColor = () => {
    if (position === 1) return "bg-racing-red";
    if (position <= 3) return "bg-accent";
    if (position <= 10) return "bg-muted";
    return "bg-racing-gray";
  };

  const getConcernColor = (level: string) => {
    switch (level) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-racing-red/50 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${getPositionColor()} text-primary-foreground font-bold text-xl px-3 py-1 rounded`}>
              P{position}
            </div>
            <div>
              <CardTitle className="text-lg">#{carNumber} {driverName}</CardTitle>
              <p className="text-sm text-muted-foreground">{team}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gauge className="h-4 w-4" />
              Speed
            </div>
            <p className="text-2xl font-bold text-foreground">{speed} <span className="text-sm">kph</span></p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last Lap
            </div>
            <p className="text-2xl font-bold text-foreground">{lastLapTime}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              Gap
            </div>
            <p className="text-lg font-bold text-foreground">{gapToLeader}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Lap
            </div>
            <p className="text-lg font-bold text-foreground">{currentLap}/26</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Race Progress</span>
            <span className="font-semibold text-foreground">{progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-racing transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Button 
          onClick={handleAIAnalysis} 
          disabled={loading}
          className="w-full"
          variant="secondary"
        >
          {loading ? "Analyzing..." : "Get AI Analysis"}
        </Button>

        {aiAnalysis && (
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <Badge variant={getConcernColor(aiAnalysis.concernLevel)}>
                {aiAnalysis.concernLevel.toUpperCase()}
              </Badge>
              <span className="text-xs text-muted-foreground">Predicted: P{aiAnalysis.predictedFinish}</span>
            </div>
            <p className="text-sm font-medium text-foreground">{aiAnalysis.recommendation}</p>
            <p className="text-xs text-muted-foreground">{aiAnalysis.strategyTip}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
