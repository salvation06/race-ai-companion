import { CarSnapshot } from './types';

export class DriverStateAgent {
  private baselineMetrics = {
    heartRate: 140, // bpm during racing
    hrv: 45, // Heart rate variability (ms)
    respirationRate: 24, // breaths per minute
    skinTemp: 34.5, // Celsius
    gsr: 8.5 // Galvanic skin response
  };

  analyzeDriverState(carSnapshot: CarSnapshot, paceData: any) {
    const { carNumber, driver, lapsCompleted, position } = carSnapshot;
    const driverId = `${carNumber}-${driver.split(' ')[0].toLowerCase()}`;
    
    // Simulate BLE sensor data
    const biometrics = this.simulateBLESensors(carSnapshot, paceData);
    
    // Calculate fatigue score (0-100, higher = more fatigued)
    const fatigueScore = this.calculateFatigueScore(biometrics, lapsCompleted, position);
    
    // Calculate stress level
    const stressLevel = this.calculateStressLevel(biometrics, position);
    
    // Assess cognitive load
    const cognitiveLoad = this.assessCognitiveLoad(biometrics, paceData);
    
    // Generate recommendations
    const recommendations = this.generateDriverRecommendations(fatigueScore, stressLevel, cognitiveLoad);
    
    return {
      driverId,
      carNumber,
      driver,
      fatigueScore,
      stressLevel,
      cognitiveLoad,
      biometrics,
      recommendations,
      alertLevel: this.determineAlertLevel(fatigueScore, stressLevel)
    };
  }

  private simulateBLESensors(car: CarSnapshot, paceData: any) {
    const lapStress = car.lapsCompleted / 26;
    const positionStress = car.position <= 3 ? 0.2 : 0;
    
    return {
      heartRate: this.baselineMetrics.heartRate + (lapStress * 15) + (positionStress * 10) + (Math.random() * 5 - 2.5),
      hrv: this.baselineMetrics.hrv - (lapStress * 8) - (positionStress * 5),
      respirationRate: this.baselineMetrics.respirationRate + (lapStress * 4),
      skinTemp: this.baselineMetrics.skinTemp + (lapStress * 2),
      gsr: this.baselineMetrics.gsr + (lapStress * 2) + (positionStress * 1.5)
    };
  }

  private calculateFatigueScore(biometrics: any, lapsCompleted: number, position: number): number {
    const lapFactor = (lapsCompleted / 26) * 60;
    const hrvFactor = (1 - (biometrics.hrv / 45)) * 25;
    const positionStress = position <= 5 ? 10 : 0;
    
    return Math.min(100, lapFactor + hrvFactor + positionStress);
  }

  private calculateStressLevel(biometrics: any, position: number): string {
    const heartRateStress = (biometrics.heartRate - 140) / 20;
    const gsrStress = (biometrics.gsr - 8.5) / 3;
    const positionFactor = position <= 3 ? 0.3 : 0;
    
    const totalStress = heartRateStress + gsrStress + positionFactor;
    
    if (totalStress > 1.5) return 'high';
    if (totalStress > 0.8) return 'medium';
    return 'low';
  }

  private assessCognitiveLoad(biometrics: any, paceData: any): string {
    const hrvLoad = 1 - (biometrics.hrv / 45);
    const respLoad = (biometrics.respirationRate - 24) / 10;
    
    const totalLoad = (hrvLoad + respLoad) / 2;
    
    if (totalLoad > 0.7) return 'high';
    if (totalLoad > 0.4) return 'medium';
    return 'low';
  }

  private generateDriverRecommendations(fatigue: number, stress: string, cogLoad: string): string[] {
    const recommendations: string[] = [];
    
    if (fatigue > 70) {
      recommendations.push('Focus on smooth breathing on straights');
      recommendations.push('Reduce steering corrections - drive more fluidly');
    } else if (fatigue > 50) {
      recommendations.push('Maintain hydration and breathing rhythm');
    }
    
    if (stress === 'high') {
      recommendations.push('Stay calm - control breathing between corners');
    }
    
    if (cogLoad === 'high') {
      recommendations.push('Simplify driving - focus on one corner at a time');
    }
    
    return recommendations;
  }

  private determineAlertLevel(fatigue: number, stress: string): string {
    if (fatigue > 80 || stress === 'high') return 'high';
    if (fatigue > 60 || stress === 'medium') return 'medium';
    return 'low';
  }
}
