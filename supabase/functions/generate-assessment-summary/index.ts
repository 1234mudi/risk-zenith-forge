import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { assessmentData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a risk assessment analyst. Generate a concise executive summary for a risk assessment report. 
Keep it professional, clear, and actionable. Format the response as JSON with these fields:
- executiveSummary: 2-3 sentences overview
- inherentRiskSummary: 1-2 sentences about inherent risk
- controlSummary: 1-2 sentences about control effectiveness  
- residualRiskSummary: 1-2 sentences about residual risk
- recommendations: array of 2-3 brief recommendations`;

    const userPrompt = `Generate a summary for this risk assessment:
- Risk Name: ${assessmentData.risk}
- ERA ID: ${assessmentData.eraId}
- Inherent Risk Score: ${assessmentData.inherentScore} (${assessmentData.inherentLabel})
- Control Effectiveness Score: ${assessmentData.controlScore}
- Residual Risk Score: ${assessmentData.residualScore} (${assessmentData.residualLabel})
- Risk Appetite: ${assessmentData.riskAppetite}
- Within Appetite: ${assessmentData.isWithinAppetite ? 'Yes' : 'No'}
- Assessment Date: ${assessmentData.assessmentDate}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_summary",
              description: "Generate structured assessment summary",
              parameters: {
                type: "object",
                properties: {
                  executiveSummary: { type: "string" },
                  inherentRiskSummary: { type: "string" },
                  controlSummary: { type: "string" },
                  residualRiskSummary: { type: "string" },
                  recommendations: { 
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["executiveSummary", "inherentRiskSummary", "controlSummary", "residualRiskSummary", "recommendations"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_summary" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const summary = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify({ summary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Failed to generate summary");
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
