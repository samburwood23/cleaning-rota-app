import { supabase } from '../lib/supabase';

export interface Household {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  theme: string;
  rotation_day: number;
  created_at: string;
}

export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  display_name: string;
  color: string;
  role: 'admin' | 'member';
  created_at: string;
}

/**
 * Create a new household
 */
export async function createHousehold(name: string): Promise<{ household: Household | null; error: any }> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { household: null, error: { message: 'Not authenticated' } };
  }

  const { data, error } = await supabase
    .from('households')
    .insert({
      name,
      created_by: user.id,
    })
    .select()
    .single();

  return { household: data, error };
}

/**
 * Get all households for the current user
 */
export async function getUserHouseholds(): Promise<{ households: Household[]; error: any }> {
  const { data, error } = await supabase
    .from('households')
    .select('*')
    .order('created_at', { ascending: false });

  return { households: data || [], error };
}

/**
 * Get a specific household by ID
 */
export async function getHousehold(householdId: string): Promise<{ household: Household | null; error: any }> {
  const { data, error } = await supabase
    .from('households')
    .select('*')
    .eq('id', householdId)
    .single();

  return { household: data, error };
}

/**
 * Update household settings
 */
export async function updateHousehold(
  householdId: string,
  updates: { name?: string; theme?: string; rotation_day?: number }
): Promise<{ household: Household | null; error: any }> {
  const { data, error } = await supabase
    .from('households')
    .update(updates)
    .eq('id', householdId)
    .select()
    .single();

  return { household: data, error };
}

/**
 * Join a household using an invite code
 */
export async function joinHousehold(inviteCode: string, displayName: string): Promise<{ success: boolean; error: any }> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: { message: 'Not authenticated' } };
  }

  // Find household by invite code
  const { data: household, error: householdError } = await supabase
    .from('households')
    .select('id')
    .eq('invite_code', inviteCode)
    .single();

  if (householdError || !household) {
    return { success: false, error: { message: 'Invalid invite code' } };
  }

  // Add user as member
  const { error: memberError } = await supabase
    .from('household_members')
    .insert({
      household_id: household.id,
      user_id: user.id,
      display_name: displayName,
      role: 'member',
    });

  if (memberError) {
    // Check if user is already a member
    if (memberError.code === '23505') {
      return { success: false, error: { message: 'You are already a member of this household' } };
    }
    return { success: false, error: memberError };
  }

  return { success: true, error: null };
}

/**
 * Get all members of a household
 */
export async function getHouseholdMembers(householdId: string): Promise<{ members: HouseholdMember[]; error: any }> {
  const { data, error } = await supabase
    .from('household_members')
    .select('*')
    .eq('household_id', householdId)
    .order('created_at', { ascending: true });

  return { members: data || [], error };
}

/**
 * Remove a member from a household
 */
export async function removeMember(householdId: string, userId: string): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from('household_members')
    .delete()
    .eq('household_id', householdId)
    .eq('user_id', userId);

  return { success: !error, error };
}

/**
 * Update member details
 */
export async function updateMember(
  householdId: string,
  userId: string,
  updates: { display_name?: string; color?: string; role?: 'admin' | 'member' }
): Promise<{ member: HouseholdMember | null; error: any }> {
  const { data, error } = await supabase
    .from('household_members')
    .update(updates)
    .eq('household_id', householdId)
    .eq('user_id', userId)
    .select()
    .single();

  return { member: data, error };
}

/**
 * Delete a household (admin only)
 */
export async function deleteHousehold(householdId: string): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from('households')
    .delete()
    .eq('id', householdId);

  return { success: !error, error };
}

/**
 * Get current user's role in a household
 */
export async function getUserRole(householdId: string): Promise<{ role: 'admin' | 'member' | null; error: any }> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { role: null, error: { message: 'Not authenticated' } };
  }

  const { data, error } = await supabase
    .from('household_members')
    .select('role')
    .eq('household_id', householdId)
    .eq('user_id', user.id)
    .single();

  return { role: data?.role || null, error };
}
