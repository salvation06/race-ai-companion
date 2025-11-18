import { CarSnapshot } from './types';

export class LeadChaseAgent {
  private overtakingZones = [
    { corner: 'T1', difficulty: 'medium', successRate: 0.65 },
    { corner: 'T4', difficulty: 'hard', successRate: 0.45 },
    { corner: 'T7', difficulty: 'medium', successRate: 0.60 },
    { corner: 'T12', difficulty: 'easy', successRate: 0.75 },
    { corner: 'T14', difficulty: 'medium', successRate: 0.55 }
  ];

  calculateCatchUp(carSnapshot: CarSnapshot, leaderSnapshot: CarSnapshot, lapsRemaining: number) {
    const { carNumber, position, gapToFirstSec } = carSnapshot;
    
    // Only analyze cars within catching distance
    if (position === 1 || !gapToFirstSec || gapToFirstSec > 10) {
      return null;
    }
    
    // Calculate required pace improvement
    const requiredDeltaPerLap = gapToFirstSec / lapsRemaining;
    
    // Assess feasibility
    const feasibility = this.assessFeasibility(requiredDeltaPerLap, carSnapshot);
    
    // Identify overtaking opportunities
    const overtakingOpportunities = this.identifyOvertakingZones(carSnapshot, leaderSnapshot);
    
    // Generate tactical plan
    const tacticalPlan = this.generateTacticalPlan(
      carSnapshot,
      leaderSnapshot,
      requiredDeltaPerLap,
      feasibility,
      overtakingOpportunities
    );
    
    return {
      carNumber,
      targetCarNumber: leaderSnapshot.carNumber,
      position,
      currentGapSec: gapToFirstSec,
      targetGapSec: 0,
      lapsRemaining,
      requiredDeltaPerLap,
      feasibility,
      overtakingOpportunities,
      tacticalPlan,
      recommendedFocusCorners: this.getRecommendedCorners(overtakingOpportunities)
    };
  }

  private assessFeasibility(requiredDelta: number, car: CarSnapshot): string {
    const lapTimeDiff = car.lastLapTimeSec - car.bestLapTimeSec;
    
    if (requiredDelta < 0.1) return 'very-high';
    if (requiredDelta < 0.2 && lapTimeDiff < 0.5) return 'high';
    if (requiredDelta < 0.3) return 'medium';
    if (requiredDelta < 0.5) return 'low';
    return 'very-low';
  }

  private identifyOvertakingZones(car: CarSnapshot, leader: CarSnapshot) {
    // Simulate sector analysis - in real implementation would use actual sector times
    return this.overtakingZones.filter(zone => zone.successRate > 0.55);
  }

  private generateTacticalPlan(
    car: CarSnapshot,
    leader: CarSnapshot,
    requiredDelta: number,
    feasibility: string,
    opportunities: typeof this.overtakingZones
  ): string {
    if (feasibility === 'very-high' || feasibility === 'high') {
      return `Close gap by ${requiredDelta.toFixed(2)}s per lap. Attack in ${opportunities[0]?.corner || 'T12'}. You have the pace advantage.`;
    }
    if (feasibility === 'medium') {
      return `Push hard to close ${requiredDelta.toFixed(2)}s per lap. Focus on exits of ${opportunities.slice(0, 2).map(o => o.corner).join(' and ')}.`;
    }
    return `Gap closing requires ${requiredDelta.toFixed(2)}s per lap - challenging but possible. Maintain pressure and wait for leader mistake.`;
  }

  private getRecommendedCorners(opportunities: typeof this.overtakingZones): string[] {
    return opportunities.slice(0, 3).map(o => o.corner);
  }
}
