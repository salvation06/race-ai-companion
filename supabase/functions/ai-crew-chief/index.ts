import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { carContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const {
      car,
      paceAnalysis,
      weatherAnalysis,
      engineTire,
      driverState,
      leadChase
    } = carContext;

    // Build comprehensive context for LLM
    const contextSummary = buildContextSummary(car, paceAnalysis, weatherAnalysis, engineTire, driverState, leadChase);
    
    // Determine scenario
    const scenario = determineScenario(car.position, leadChase);

    // Build prompt
    const prompt = buildPrompt(scenario, car, contextSummary);

    console.log('Calling Lovable AI with prompt:', prompt.substring(0, 200));

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI Crew Chief for Toyota GR Cup racing. Provide concise, tactical coaching advice in 2-3 sentences max. Focus on actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`Lovable AI API error: ${response.status}`);
    }

    const data = await response.json();
    const insight = data.choices[0].message.content;

    return new Response(
      JSON.stringify({
        carNumber: car.carNumber,
        lapCurrent: car.currentLap,
        insight,
        priority: determinePriority(paceAnalysis, driverState, engineTire),
        scenario
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-crew-chief:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function buildContextSummary(car: any, pace: any, weather: any, engineTire: any, driver: any, chase: any) {
  const parts = [];
  
  parts.push(`Position: P${car.position}, Lap ${car.currentLap}/26`);
  
  if (pace) {
    parts.push(`Pace: ${pace.trend} (z-score: ${pace.zScore.toFixed(2)})`);
    if (pace.heroLapFlag) parts.push('HERO LAP');
    if (pace.fallingBackFlag) parts.push('FALLING BACK');
  }
  
  if (engineTire) {
    parts.push(`Tires: ${engineTire.tireWear.toFixed(0)}% wear, ${engineTire.recommendedMode} mode`);
    parts.push(`Engine: ${engineTire.engineHealth.toFixed(0)}% health`);
  }
  
  if (driver) {
    parts.push(`Driver: ${driver.fatigueScore.toFixed(0)}% fatigue, ${driver.stressLevel} stress`);
  }
  
  if (weather) {
    parts.push(`Track: ${weather.trackGripScore.toFixed(2)} grip, ${weather.riskLevel} risk`);
  }
  
  if (chase) {
    parts.push(`Gap: ${chase.currentGapSec.toFixed(2)}s, need ${chase.requiredDeltaPerLap.toFixed(2)}s/lap`);
  }
  
  return parts.join('. ');
}

function determineScenario(position: number, chase: any): string {
  if (position === 1) return 'leader';
  if (chase && chase.feasibility === 'high') return 'chasing';
  if (position <= 5) return 'defending';
  return 'midpack';
}

function buildPrompt(scenario: string, car: any, context: string): string {
  const templates = {
    leader: `You are leading the race (P1). ${context}. Give brief tactical advice to maintain the lead.`,
    chasing: `You are P${car.position} chasing the leader. ${context}. Give brief tactical advice to close the gap.`,
    defending: `You are P${car.position} defending your position. ${context}. Give brief tactical advice.`,
    midpack: `You are P${car.position} in midpack. ${context}. Give brief tactical advice to improve position.`
  };
  
  return templates[scenario as keyof typeof templates] || templates.midpack;
}

function determinePriority(pace: any, driver: any, engineTire: any): string {
  if (pace?.fallingBackFlag || driver?.alertLevel === 'high' || engineTire?.tireWear > 80) {
    return 'high';
  }
  if (pace?.heroLapFlag || driver?.alertLevel === 'medium') {
    return 'medium';
  }
  return 'low';
}
