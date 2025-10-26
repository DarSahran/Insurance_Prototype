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
    console.log('👉 Parameters:', JSON.stringify(mlParameters, null, 2));

    // Use Gradio API endpoint format
    const gradioApiUrl = 'https://darsahran-insurance-ml-api.hf.space/call/predict_insurance_optimized';
    console.log('📤 Calling Gradio API:', gradioApiUrl);

    // Send prediction request
    const response = await fetch(gradioApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          mlParameters.age,
          mlParameters.gender,
          mlParameters.marital_status,
          mlParameters.education_level,
          mlParameters.city,
          mlParameters.region_type,
          mlParameters.annual_income_range,
          mlParameters.has_debt,
          mlParameters.is_sole_provider,
          mlParameters.has_savings,
          mlParameters.investment_capacity,
          mlParameters.height_cm,
          mlParameters.weight_kg,
          mlParameters.blood_pressure_systolic,
          mlParameters.blood_pressure_diastolic,
          mlParameters.resting_heart_rate,
          mlParameters.blood_sugar_fasting,
          mlParameters.condition_heart_disease,
          mlParameters.condition_asthma,
          mlParameters.condition_thyroid,
          mlParameters.condition_cancer_history,
          mlParameters.condition_kidney_disease,
          mlParameters.smoking_status,
          mlParameters.years_smoking,
          mlParameters.alcohol_consumption,
          mlParameters.exercise_frequency_weekly,
          mlParameters.sleep_hours_avg,
          mlParameters.stress_level,
          mlParameters.dependent_children_count,
          mlParameters.dependent_parents_count,
          mlParameters.occupation_type,
          mlParameters.insurance_type_requested,
          mlParameters.coverage_amount_requested,
          mlParameters.policy_period_years,
          mlParameters.monthly_premium_budget,
          mlParameters.has_existing_policies,
          mlParameters.num_assessments_started,
          mlParameters.num_assessments_completed
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gradio API Error:', response.status, response.statusText, errorText);
      throw new Error(`Gradio API error: ${response.status} ${response.statusText}`);
    }

    const callResult = await response.json();
    console.log('✅ Call initiated, event_id:', callResult.event_id);

    // Now fetch the result using the event_id
    const resultUrl = `https://darsahran-insurance-ml-api.hf.space/call/predict_insurance_optimized/${callResult.event_id}`;
    console.log('🔍 Fetching result from:', resultUrl);

    const resultResponse = await fetch(resultUrl);
    
    if (!resultResponse.ok) {
      throw new Error(`Failed to fetch result: ${resultResponse.status}`);
    }

    // Read the streaming response
    const reader = resultResponse.body?.getReader();
    const decoder = new TextDecoder();
    let finalResult = null;

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.output && data.output.data) {
                finalResult = data.output.data;
              }
            } catch (e) {
              console.log('Could not parse line:', line);
            }
          }
        }
      }
    }

    if (!finalResult) {
      throw new Error('No result received from Gradio API');
    }

    console.log('✅ Final Result:', JSON.stringify(finalResult, null, 2));

    // Parse the JSON response from the third element (Full API Response)
    let parsedResult;
    try {
      parsedResult = JSON.parse(finalResult[2]);
    } catch (e) {
      console.error('Failed to parse result:', e);
      throw new Error('Invalid response format from ML API');
    }

    return new Response(
      JSON.stringify(parsedResult),
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