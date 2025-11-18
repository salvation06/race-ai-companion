import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Gauge, Activity, Target } from "lucide-react";

interface AgentAnalysisPanelProps {
  analysis: any;
}

export const AgentAnalysisPanel = ({ analysis }: AgentAnalysisPanelProps) => {
  if (!analysis) return null;

  const { paceAnalysis, weatherAnalysis, engineTire, driverState, leadChase, llmInsight } = analysis;

  return (
    <div className="space-y-4">
      {/* LLM Insight - Top Priority */}
      {llmInsight && (
        <Card className="border-racing-red/50 bg-accent/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-racing-red" />
                AI Crew Chief
              </CardTitle>
              <Badge variant={llmInsight.priority === 'high' ? 'destructive' : 'secondary'}>
                {llmInsight.priority}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-foreground">{llmInsight.insight}</p>
          </CardContent>
        </Card>
      )}

      {/* Pace Analysis */}
      {paceAnalysis && (
        <Card className="bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Pace Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Trend:</span>
              <Badge variant={paceAnalysis.heroLapFlag ? 'default' : paceAnalysis.fallingBackFlag ? 'destructive' : 'outline'}>
                {paceAnalysis.trend}
              </Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Consistency:</span>
              <span className="font-semibold">{paceAnalysis.consistency.toFixed(0)}%</span>
            </div>
            <p className="text-xs text-muted-foreground">{paceAnalysis.recommendation}</p>
          </CardContent>
        </Card>
      )}

      {/* Engine & Tire Health */}
      {engineTire && (
        <Card className="bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Component Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tire Wear:</span>
                <span className="font-semibold">{engineTire.tireWear.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${engineTire.tireWear > 80 ? 'bg-destructive' : engineTire.tireWear > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${engineTire.tireWear}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Engine Health:</span>
                <span className="font-semibold">{engineTire.engineHealth.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${engineTire.engineHealth < 30 ? 'bg-destructive' : 'bg-green-500'}`}
                  style={{ width: `${engineTire.engineHealth}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Mode:</span>
              <Badge variant="outline">{engineTire.recommendedMode}</Badge>
            </div>
            {engineTire.warnings.length > 0 && (
              <div className="pt-2 space-y-1">
                {engineTire.warnings.map((warning: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-1 text-xs text-yellow-600">
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Driver State */}
      {driverState && (
        <Card className="bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Driver State
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Fatigue:</span>
              <span className="font-semibold">{driverState.fatigueScore.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Stress:</span>
              <Badge variant={driverState.stressLevel === 'high' ? 'destructive' : driverState.stressLevel === 'medium' ? 'secondary' : 'outline'}>
                {driverState.stressLevel}
              </Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Heart Rate:</span>
              <span className="font-semibold">{driverState.biometrics.heartRate.toFixed(0)} bpm</span>
            </div>
            {driverState.recommendations.length > 0 && (
              <div className="pt-2 space-y-1">
                {driverState.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                  <p key={idx} className="text-xs text-muted-foreground">{rec}</p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lead Chase */}
      {leadChase && (
        <Card className="bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Chase Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Gap:</span>
              <span className="font-semibold">{leadChase.currentGapSec.toFixed(2)}s</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Required Δ/lap:</span>
              <span className="font-semibold">{leadChase.requiredDeltaPerLap.toFixed(2)}s</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Feasibility:</span>
              <Badge variant={leadChase.feasibility === 'very-high' || leadChase.feasibility === 'high' ? 'default' : 'outline'}>
                {leadChase.feasibility}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground pt-2">{leadChase.tacticalPlan}</p>
          </CardContent>
        </Card>
      )}

      {/* Weather */}
      {weatherAnalysis && (
        <Card className="bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Track Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Grip:</span>
              <span className="font-semibold">{weatherAnalysis.trackGripScore.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Track Temp:</span>
              <span className="font-semibold">{weatherAnalysis.current.trackTempC}°C</span>
            </div>
            <p className="text-xs text-muted-foreground">{weatherAnalysis.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
