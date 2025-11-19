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
    const { question, carContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    if (!question) {
      throw new Error('Question is required');
    }

    // Build context if provided
    let contextPrompt = '';
    if (carContext) {
      const { position, currentLap, speed, analysis } = carContext;
      contextPrompt = `\n\nCurrent Race Context:
- Position: P${position}
- Lap: ${currentLap}/26
- Speed: ${speed} km/h`;

      if (analysis?.paceAnalysis) {
        contextPrompt += `\n- Pace Trend: ${analysis.paceAnalysis.trend}`;
      }
      if (analysis?.engineTire) {
        contextPrompt += `\n- Tire Wear: ${analysis.engineTire.tireWear.toFixed(0)}%`;
        contextPrompt += `\n- Engine Health: ${analysis.engineTire.engineHealth.toFixed(0)}%`;
      }
      if (analysis?.driverState) {
        contextPrompt += `\n- Driver Fatigue: ${analysis.driverState.fatigueScore.toFixed(0)}%`;
      }
    }

    const systemPrompt = `You are an expert AI Crew Chief for Toyota GR Cup racing. Your role is to provide concise, tactical advice to the driver in 2-3 sentences max. Focus on actionable insights. Be direct, professional, and supportive. Use racing terminology naturally.${contextPrompt}`;

    console.log('Calling Lovable AI for Q&A:', { question: question.substring(0, 50) });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 200
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ answer }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in crew-chief-qa:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
