import { WeatherSnapshot } from './types';

export class WeatherAgent {
  private baseGrip = 0.85;
  private tempOptimal = 25;
  private humidityPenalty = 0.001;
  private windPenalty = 0.01;

  analyzeWeather(weatherSnapshot: WeatherSnapshot) {
    const { airTempC, trackTempC, humidityPct, windSpeedKph, conditions } = weatherSnapshot;
    
    // Calculate track grip score
    const trackGripScore = this.calculateTrackGrip(weatherSnapshot);
    
    // Assess risk level
    const riskLevel = this.assessRiskLevel(weatherSnapshot, trackGripScore);
    
    // Generate insights
    const notes = this.generateWeatherInsights(weatherSnapshot, trackGripScore);
    
    // Predict tire degradation rate
    const tireDegradationRate = this.predictTireDegradation(trackTempC);
    
    return {
      current: weatherSnapshot,
      trackGripScore,
      riskLevel,
      notes,
      tireDegradationRate,
      recommendations: this.generateRecommendations(trackGripScore, trackTempC)
    };
  }

  private calculateTrackGrip(weather: WeatherSnapshot): number {
    let grip = this.baseGrip;
    
    // Temperature impact
    const tempDiff = Math.abs(weather.trackTempC - this.tempOptimal);
    grip -= tempDiff * 0.01;
    
    // Humidity impact
    grip -= weather.humidityPct * this.humidityPenalty;
    
    // Wind impact
    grip -= weather.windSpeedKph * this.windPenalty;
    
    // Conditions impact
    if (weather.conditions === 'Wet') grip *= 0.6;
    else if (weather.conditions === 'Mixed') grip *= 0.75;
    else if (weather.conditions === 'Cloudy') grip *= 0.95;
    
    return Math.max(0.4, Math.min(1.0, grip));
  }

  private assessRiskLevel(weather: WeatherSnapshot, grip: number): string {
    if (grip < 0.65 || weather.conditions === 'Wet') return 'high';
    if (grip < 0.75 || weather.trackTempC > 35) return 'medium';
    return 'low';
  }

  private generateWeatherInsights(weather: WeatherSnapshot, grip: number): string {
    if (weather.trackTempC > 32) {
      return 'High track temperature increasing tire wear by ~5% over next 5 laps.';
    }
    if (grip < 0.7) {
      return 'Reduced grip conditions. Consider conservative lines through high-speed corners.';
    }
    return 'Optimal track conditions for consistent pace.';
  }

  private predictTireDegradation(trackTemp: number): number {
    const baseDegradation = 3.85; // % per lap
    const tempFactor = 1 + ((trackTemp - 25) * 0.02);
    return baseDegradation * tempFactor;
  }

  private generateRecommendations(grip: number, trackTemp: number): string[] {
    const recommendations: string[] = [];
    
    if (grip < 0.75) {
      recommendations.push('Reduce steering angle by 3% in long corners');
    }
    if (trackTemp > 30) {
      recommendations.push('Monitor tire pressure closely');
      recommendations.push('Consider conservative pace to preserve tires');
    }
    if (trackTemp < 20) {
      recommendations.push('Push harder to maintain tire temperatures');
    }
    
    return recommendations;
  }
}
