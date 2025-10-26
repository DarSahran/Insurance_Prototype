import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('🤖 ML Prediction Edge Function Called');
    
    const mlParameters = await req.json();
    console.log('📊 Received ML Parameters:', Object.keys(mlParameters).length, 'parameters');

    // Call HuggingFace Spaces API
    const huggingFaceUrl = 'https://huggingface.co/spaces/darsahran/insurance-ml-api/api/predict';
    console.log('📤 Calling HuggingFace API:', huggingFaceUrl);

    const response = await fetch(huggingFaceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [mlParameters] }),
    });

    if (!response.ok) {
      console.error('❌ HuggingFace API Error:', response.status, response.statusText);
      throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ HuggingFace API Response Received');
    console.log('📊 Prediction Result:', JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('❌ Edge Function Error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        details: error.toString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});