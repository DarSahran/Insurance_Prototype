import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Client } from "npm:@gradio/client@1.6.0";

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

    // Connect to Gradio Space using official client
    console.log('🔗 Connecting to Gradio Space: darsahran/insurance-ml-api');
    const client = await Client.connect("darsahran/insurance-ml-api");
    console.log('✅ Connected to Gradio Space successfully');

    // Make prediction using the proper API
    console.log('🚀 Making prediction call...');
    const result = await client.predict("/predict_insurance_optimized", {
      age: mlParameters.age,
      gender: mlParameters.gender,
      marital_status: mlParameters.marital_status,
      education_level: mlParameters.education_level,
      city: mlParameters.city,
      region_type: mlParameters.region_type,
      annual_income_range: mlParameters.annual_income_range,
      has_debt: mlParameters.has_debt,
      is_sole_provider: mlParameters.is_sole_provider,
      has_savings: mlParameters.has_savings,
      investment_capacity: mlParameters.investment_capacity,
      height_cm: mlParameters.height_cm,
      weight_kg: mlParameters.weight_kg,
      blood_pressure_systolic: mlParameters.blood_pressure_systolic,
      blood_pressure_diastolic: mlParameters.blood_pressure_diastolic,
      resting_heart_rate: mlParameters.resting_heart_rate,
      blood_sugar_fasting: mlParameters.blood_sugar_fasting,
      condition_heart_disease: mlParameters.condition_heart_disease,
      condition_asthma: mlParameters.condition_asthma,
      condition_thyroid: mlParameters.condition_thyroid,
      condition_cancer_history: mlParameters.condition_cancer_history,
      condition_kidney_disease: mlParameters.condition_kidney_disease,
      smoking_status: mlParameters.smoking_status,
      years_smoking: mlParameters.years_smoking,
      alcohol_consumption: mlParameters.alcohol_consumption,
      exercise_frequency_weekly: mlParameters.exercise_frequency_weekly,
      sleep_hours_avg: mlParameters.sleep_hours_avg,
      stress_level: mlParameters.stress_level,
      dependent_children_count: mlParameters.dependent_children_count,
      dependent_parents_count: mlParameters.dependent_parents_count,
      occupation_type: mlParameters.occupation_type,
      insurance_type_requested: mlParameters.insurance_type_requested,
      coverage_amount_requested: mlParameters.coverage_amount_requested,
      policy_period_years: mlParameters.policy_period_years,
      monthly_premium_budget: mlParameters.monthly_premium_budget,
      has_existing_policies: mlParameters.has_existing_policies,
      num_assessments_started: mlParameters.num_assessments_started,
      num_assessments_completed: mlParameters.num_assessments_completed
    });

    console.log('✅ Prediction received from Gradio');
    console.log('📊 Result data:', JSON.stringify(result.data, null, 2));

    // Extract the JSON response from the third element
    const fullApiResponse = result.data[2];
    let parsedResult;

    try {
      parsedResult = JSON.parse(fullApiResponse);
      console.log('✅ Parsed API response:', JSON.stringify(parsedResult, null, 2));
    } catch (e) {
      console.error('❌ Failed to parse result:', e);
      throw new Error('Invalid response format from ML API');
    }

    // Return the parsed result
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
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        details: error.toString(),
        stack: error.stack
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