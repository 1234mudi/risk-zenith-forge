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
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'rating') {
      systemPrompt = `You are a risk assessment expert. Based on the risk context provided, suggest the most appropriate rating value (1-5 scale) where:
1 = Very Low/Minimal
2 = Low
3 = Moderate
4 = High
5 = Very High/Critical

Respond with ONLY a single number (1-5) without any explanation.`;
      
      userPrompt = `Risk Factor: ${context.factorName}
Description: ${context.description || 'N/A'}
Risk Context: ${context.riskContext || 'General risk assessment'}

What rating (1-5) should this factor receive?`;
    } else if (type === 'comment') {
      systemPrompt = `You are a risk assessment expert. Generate a clear, professional justification for why a specific rating was selected. Keep it concise (2-3 sentences) and focus on the key reasons.`;
      
      userPrompt = `Risk Factor: ${context.factorName}
Description: ${context.description || 'N/A'}
Rating Given: ${context.rating}
Risk Context: ${context.riskContext || 'General risk assessment'}

Provide a brief justification for this rating.`;
    } else if (type === 'autofill-all') {
      systemPrompt = `You are a risk assessment expert. You will receive multiple risk factors and need to provide ratings (1-5 scale) and justifications for each.

Rating Scale:
1 = Very Low/Minimal
2 = Low
3 = Moderate
4 = High
5 = Very High/Critical

Respond with a JSON array where each object has:
- id: the factor id
- rating: number (1-5)
- comment: brief justification (2-3 sentences)`;

      userPrompt = `Risk Context: ${context.riskContext || 'General risk assessment'}

Factors to rate:
${context.factors.map((f: any) => `
ID: ${f.id}
Name: ${f.name}
Description: ${f.description || 'N/A'}
`).join('\n')}

Provide ratings and justifications for all factors.`;
    }

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
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    return new Response(JSON.stringify({ result: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-autofill-rating function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});