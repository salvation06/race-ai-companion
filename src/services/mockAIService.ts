// Mock AI Service for future LLM integration

export interface AIRaceAnalysis {
  carNumber: string;
  recommendation: string;
  strategyTip: string;
  concernLevel: 'low' | 'medium' | 'high';
  predictedFinish: number;
}

export const mockAIAnalyze = async (raceData: any): Promise<AIRaceAnalysis> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const strategies = [
    "Maintain current pace - tire degradation is minimal",
    "Push harder in sector 2 - you're losing time in turns 7-10",
    "Conserve tires for final 5 laps - degradation pattern detected",
    "Attack now - gap to car ahead is closing",
    "Defend position - car behind is gaining 0.2s per lap"
  ];
  
  const tips = [
    "Brake 5 meters later entering Turn 1",
    "Use 4th gear through Turn 7 for better exit speed",
    "Open steering sooner on exit of Turn 4",
    "Reduce steering angle 3% in long corners to save tires",
    "Target sector 1 split under 33.1 seconds"
  ];
  
  const concerns: Array<'low' | 'medium' | 'high'> = ['low', 'low', 'medium', 'low', 'high'];
  
  return {
    carNumber: raceData.carNumber,
    recommendation: strategies[Math.floor(Math.random() * strategies.length)],
    strategyTip: tips[Math.floor(Math.random() * tips.length)],
    concernLevel: concerns[Math.floor(Math.random() * concerns.length)],
    predictedFinish: raceData.position + Math.floor(Math.random() * 3) - 1
  };
};

// Future: Replace with actual LLM API call
export const sendToLLM = async (prompt: string, context: any) => {
  // This will be replaced with actual Lovable AI integration
  console.log('Mock LLM Call:', { prompt, context });
  return mockAIAnalyze(context);
};
