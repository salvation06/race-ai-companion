import { CarSnapshot } from './types';

export class PaceRegressionAgent {
  private carHistory: Map<number, number[]> = new Map();

  analyzePace(carSnapshot: CarSnapshot, historicalLaps: number[]) {
    const { carNumber, lastLapTimeSec, regressionMeanSec, regressionZScore } = carSnapshot;
    
    // Convert carNumber to number for history map
    const carNum = typeof carNumber === 'string' ? parseInt(carNumber) : carNumber;
    
    // Store lap history
    if (!this.carHistory.has(carNum)) {
      this.carHistory.set(carNum, []);
    }
    this.carHistory.get(carNum)!.push(lastLapTimeSec);
    
    // Determine trend
    const trend = this.determineTrend(regressionZScore);
    
    // Detect hero/falling back flags
    const heroLapFlag = regressionZScore < -1.5;
    const fallingBackFlag = regressionZScore > 1.5;
    
    // Calculate consistency
    const consistency = this.calculateConsistency(historicalLaps);
    
    // Sustainable target pace
    const sustainableTargetPace = this.calculateSustainableTarget(historicalLaps);
    
    return {
      carNumber,
      regressionMean: regressionMeanSec,
      zScore: regressionZScore,
      heroLapFlag,
      fallingBackFlag,
      sustainableTargetPace,
      trend,
      consistency,
      recommendation: this.generateRecommendation(trend, heroLapFlag, fallingBackFlag, consistency)
    };
  }

  private determineTrend(zScore: number): string {
    if (zScore < -1.0) return 'over-performing';
    if (zScore > 1.0) return 'under-performing';
    return 'on-trend';
  }

  private calculateConsistency(laps: number[]): number {
    if (laps.length < 2) return 100;
    const mean = laps.reduce((a, b) => a + b, 0) / laps.length;
    const variance = laps.reduce((sum, lap) => sum + Math.pow(lap - mean, 2), 0) / laps.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 100 - (stdDev * 20));
  }

  private calculateSustainableTarget(laps: number[]): number {
    if (laps.length === 0) return 100;
    // Use median of last 5 laps as sustainable target
    const recent = laps.slice(-5);
    const sorted = [...recent].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }

  private generateRecommendation(trend: string, heroLap: boolean, fallingBack: boolean, consistency: number): string {
    if (heroLap) return 'Excellent pace! Try to maintain this rhythm.';
    if (fallingBack) return 'Losing pace. Check tire wear and fuel load.';
    if (consistency < 70) return 'Focus on consistency. Smooth inputs will improve lap times.';
    if (trend === 'on-trend') return 'Steady pace. Look for opportunities to push.';
    return 'Good progress. Keep monitoring competitors.';
  }
}
