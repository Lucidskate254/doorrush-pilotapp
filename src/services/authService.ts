
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Agent authentication
export const signUpAgent = async (
  email: string,
  password: string,
  passwordConfirm: string,
  fullName: string,
  phoneNumber: string
) => {
  try {
    // Check if passwords match
    if (password !== passwordConfirm) {
      return { success: false, error: 'Passwords do not match' };
    }

    // Create the agent account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (!authData.user) {
      return { success: false, error: 'Failed to create account' };
    }

    // Create agent profile in the agents table
    const { data: agentData, error: profileError } = await supabase
      .from('agents')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        phone_number: phoneNumber,
        agent_code: generateAgentCode(),
        location: '', // Will be filled during full registration
        national_id: '', // Will be filled during full registration
        online_status: false,
        earnings: 0
      })
      .select();

    if (profileError) {
      console.error('Error creating agent profile:', profileError);
      // If profile creation fails, we should still return success since the auth account was created
      // The user will need to complete their profile later
      return { 
        success: true, 
        data: authData.user,
        warning: 'Account created but profile setup incomplete. Please complete your profile.'
      };
    }

    return { success: true, data: authData.user };
  } catch (error: any) {
    console.error('Error signing up agent:', error);
    return { success: false, error: error.message || 'Failed to sign up' };
  }
};

export const signInAgent = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Fetch agent profile to check if they have completed registration
    const { data: agentData, error: profileError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "no rows returned" code
      console.error('Error fetching agent profile:', profileError);
    }

    return { 
      success: true, 
      data,
      profileComplete: !!(agentData && agentData.full_name && agentData.national_id && agentData.location)
    };
  } catch (error: any) {
    console.error('Error signing in agent:', error);
    return { success: false, error: error.message || 'Failed to sign in' };
  }
};

// Customer authentication (for future implementation)
export const signUpCustomer = async (
  email: string,
  password: string,
  passwordConfirm: string,
  fullName: string,
  phoneNumber: string,
  address: string
) => {
  try {
    // Check if passwords match
    if (password !== passwordConfirm) {
      return { success: false, error: 'Passwords do not match' };
    }

    // Create the customer account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (!authData.user) {
      return { success: false, error: 'Failed to create account' };
    }

    // Create customer profile in the customers table
    const { data: customerData, error: profileError } = await supabase
      .from('customers')
      .insert({
        id: authData.user.id,
        full_name: fullName,
        phone_number: phoneNumber,
        address
      })
      .select();

    if (profileError) {
      console.error('Error creating customer profile:', profileError);
      // If profile creation fails, we should still return success since the auth account was created
      return { 
        success: true, 
        data: authData.user,
        warning: 'Account created but profile setup incomplete. Please complete your profile.'
      };
    }

    return { success: true, data: authData.user };
  } catch (error: any) {
    console.error('Error signing up customer:', error);
    return { success: false, error: error.message || 'Failed to sign up' };
  }
};

export const signInCustomer = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error signing in customer:', error);
    return { success: false, error: error.message || 'Failed to sign in' };
  }
};

// Common authentication functions
export const signOut = async () => {
  await supabase.auth.signOut();
};

export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error('Error refreshing session:', error);
    return { success: false, error: error.message || 'Failed to refresh session' };
  }
};

// Helper function to generate agent code
const generateAgentCode = () => {
  return 'AG' + Math.floor(100000 + Math.random() * 900000).toString();
};
