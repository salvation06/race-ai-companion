import { CarSnapshot, WeatherSnapshot } from './types';

export class EngineTireAgent {
  estimateHealth(carSnapshot: CarSnapshot, weatherData: WeatherSnapshot) {
    const { carNumber, lapsCompleted, lastLapTimeSec, bestLapTimeSec } = carSnapshot;
    
    // Calculate tire wear (0-100%)
    const tireWear = this.calculateTireWear(lapsCompleted, weatherData.trackTempC);
    
    // Calculate engine health (0-100)
    const engineHealth = this.calculateEngineHealth(lapsCompleted);
    
    // Recommend driving mode
    const recommendedMode = this.recommendDrivingMode(tireWear, engineHealth, lapsCompleted);
    
    // Predict remaining laps
    const remainingTireLaps = this.predictRemainingTireLaps(tireWear);
    const remainingEngineLaps = this.predictRemainingEngineLaps(engineHealth);
    
    // Generate warnings
    const warnings = this.generateWarnings(tireWear, engineHealth, lapsCompleted);
    
    return {
      carNumber,
      tireWear,
      engineHealth,
      recommendedMode,
      remainingTireLaps,
      remainingEngineLaps,
      warnings,
      details: {
        tireTemperature: this.estimateTireTemp(weatherData.trackTempC),
        engineTemperature: this.estimateEngineTemp(weatherData.trackTempC),
        brakeWear: this.estimateBrakeWear(lapsCompleted),
        fuelRemaining: this.estimateFuelRemaining(lapsCompleted)
      }
    };
  }

  private calculateTireWear(lapsCompleted: number, trackTemp: number): number {
    const baseWearRate = 3.85; // % per lap
    const tempFactor = 1 + ((trackTemp - 25) * 0.02);
    const wear = lapsCompleted * baseWearRate * tempFactor;
    return Math.min(100, wear);
  }

  private calculateEngineHealth(lapsCompleted: number): number {
    const baseDegradation = 0.5; // % per lap
    const health = 100 - (lapsCompleted * baseDegradation);
    return Math.max(0, health);
  }

  private recommendDrivingMode(tireWear: number, engineHealth: number, lapsCompleted: number): string {
    if (tireWear > 85 || engineHealth < 20) return 'conserve';
    if (tireWear > 70 || lapsCompleted > 20) return 'balanced';
    return 'push';
  }

  private predictRemainingTireLaps(tireWear: number): number {
    const remainingWear = 100 - tireWear;
    return Math.floor(remainingWear / 3.85);
  }

  private predictRemainingEngineLaps(engineHealth: number): number {
    return Math.floor(engineHealth / 0.5);
  }

  private generateWarnings(tireWear: number, engineHealth: number, lapsCompleted: number): string[] {
    const warnings: string[] = [];
    
    if (tireWear > 80) warnings.push('Critical tire wear - consider pit stop');
    else if (tireWear > 65) warnings.push('High tire wear - reduce aggression');
    
    if (engineHealth < 30) warnings.push('Monitor engine temperatures closely');
    
    if (lapsCompleted > 22) warnings.push('Final laps - manage component stress');
    
    return warnings;
  }

  private estimateTireTemp(trackTemp: number): number {
    return trackTemp + 45 + Math.random() * 10;
  }

  private estimateEngineTemp(trackTemp: number): number {
    return 85 + (trackTemp * 0.5) + Math.random() * 5;
  }

  private estimateBrakeWear(lapsCompleted: number): number {
    return Math.min(100, lapsCompleted * 2.8);
  }

  private estimateFuelRemaining(lapsCompleted: number): number {
    const totalFuel = 100; // %
    const fuelPerLap = 3.5; // %
    return Math.max(0, totalFuel - (lapsCompleted * fuelPerLap));
  }
}
