import { supabase } from './supabase';

export interface Vehicle {
  id: string;
  user_id: string;
  vehicle_type: string;
  make: string;
  model: string;
  year?: number;
  registration_number: string;
  chassis_number?: string;
  engine_number?: string;
  purchase_date?: string;
  current_value?: number;
  created_at: string;
  updated_at: string;
}

export interface VehiclePolicy {
  id: string;
  vehicle_id: string;
  policy_selection_id: string;
  created_at: string;
}

export interface VehicleWithPolicies extends Vehicle {
  policies?: any[];
}

// Vehicles
export async function getVehicles(userId: string): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('user_vehicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getVehicleWithPolicies(vehicleId: string): Promise<VehicleWithPolicies | null> {
  const { data: vehicle, error: vehicleError } = await supabase
    .from('user_vehicles')
    .select('*')
    .eq('id', vehicleId)
    .maybeSingle();

  if (vehicleError) throw vehicleError;
  if (!vehicle) return null;

  const { data: vehiclePolicies, error: policiesError } = await supabase
    .from('vehicle_policies')
    .select(`
      id,
      policy_selection_id,
      created_at
    `)
    .eq('vehicle_id', vehicleId);

  if (policiesError) throw policiesError;

  const policyIds = vehiclePolicies?.map(vp => vp.policy_selection_id) || [];

  let policies: any[] = [];
  if (policyIds.length > 0) {
    const { data: policyData, error: policyError } = await supabase
      .from('policy_selections')
      .select('*')
      .in('id', policyIds);

    if (policyError) throw policyError;
    policies = policyData || [];
  }

  return {
    ...vehicle,
    policies
  };
}

export async function getVehiclesWithPolicies(userId: string): Promise<VehicleWithPolicies[]> {
  const vehicles = await getVehicles(userId);

  const vehiclesWithPolicies = await Promise.all(
    vehicles.map(async (vehicle) => {
      const vehicleWithPolicies = await getVehicleWithPolicies(vehicle.id);
      return vehicleWithPolicies || vehicle;
    })
  );

  return vehiclesWithPolicies;
}

export async function createVehicle(vehicle: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('user_vehicles')
    .insert([vehicle])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('user_vehicles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_vehicles')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Vehicle Policies
export async function getVehiclePolicies(vehicleId: string): Promise<VehiclePolicy[]> {
  const { data, error } = await supabase
    .from('vehicle_policies')
    .select('*')
    .eq('vehicle_id', vehicleId);

  if (error) throw error;
  return data || [];
}

export async function linkPolicyToVehicle(vehicleId: string, policySelectionId: string): Promise<VehiclePolicy> {
  const { data, error } = await supabase
    .from('vehicle_policies')
    .insert([{ vehicle_id: vehicleId, policy_selection_id: policySelectionId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unlinkPolicyFromVehicle(vehicleId: string, policySelectionId: string): Promise<void> {
  const { error } = await supabase
    .from('vehicle_policies')
    .delete()
    .eq('vehicle_id', vehicleId)
    .eq('policy_selection_id', policySelectionId);

  if (error) throw error;
}
