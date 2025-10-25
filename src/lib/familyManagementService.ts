import { supabase } from './supabase';

export interface FamilyMember {
  id: string;
  primary_user_id: string;
  member_type: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  relationship: string;
  email?: string;
  phone?: string;
  health_information?: any;
  is_covered: boolean;
  is_beneficiary: boolean;
  beneficiary_percentage?: number;
  ssn_last_four?: string;
  created_at: string;
  updated_at: string;
}

export interface Beneficiary {
  id: string;
  primary_user_id: string;
  family_member_id?: string;
  name: string;
  relationship: string;
  percentage: number;
  policy_selection_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: string;
  primary_user_id: string;
  family_member_id?: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface FamilyMemberPolicy {
  id: string;
  family_member_id: string;
  policy_selection_id: string;
  created_at: string;
}

// Family Members
export async function getFamilyMembers(userId: string): Promise<FamilyMember[]> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('primary_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createFamilyMember(member: Omit<FamilyMember, 'id' | 'created_at' | 'updated_at'>): Promise<FamilyMember> {
  const { data, error } = await supabase
    .from('family_members')
    .insert([member])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<FamilyMember> {
  const { data, error } = await supabase
    .from('family_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFamilyMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('family_members')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Beneficiaries
export async function getBeneficiaries(userId: string): Promise<Beneficiary[]> {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('primary_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createBeneficiary(beneficiary: Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>): Promise<Beneficiary> {
  const { data, error } = await supabase
    .from('beneficiaries')
    .insert([beneficiary])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBeneficiary(id: string, updates: Partial<Beneficiary>): Promise<Beneficiary> {
  const { data, error } = await supabase
    .from('beneficiaries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBeneficiary(id: string): Promise<void> {
  const { error } = await supabase
    .from('beneficiaries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Emergency Contacts
export async function getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('primary_user_id', userId)
    .order('is_primary', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createEmergencyContact(contact: Omit<EmergencyContact, 'id' | 'created_at' | 'updated_at'>): Promise<EmergencyContact> {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .insert([contact])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEmergencyContact(id: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact> {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEmergencyContact(id: string): Promise<void> {
  const { error } = await supabase
    .from('emergency_contacts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Family Member Policies
export async function getFamilyMemberPolicies(familyMemberId: string): Promise<FamilyMemberPolicy[]> {
  const { data, error } = await supabase
    .from('family_member_policies')
    .select('*')
    .eq('family_member_id', familyMemberId);

  if (error) throw error;
  return data || [];
}

export async function linkPolicyToFamilyMember(familyMemberId: string, policySelectionId: string): Promise<FamilyMemberPolicy> {
  const { data, error } = await supabase
    .from('family_member_policies')
    .insert([{ family_member_id: familyMemberId, policy_selection_id: policySelectionId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function unlinkPolicyFromFamilyMember(familyMemberId: string, policySelectionId: string): Promise<void> {
  const { error } = await supabase
    .from('family_member_policies')
    .delete()
    .eq('family_member_id', familyMemberId)
    .eq('policy_selection_id', policySelectionId);

  if (error) throw error;
}
