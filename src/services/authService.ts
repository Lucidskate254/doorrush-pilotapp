
import { pb } from '@/integrations/pocketbase/client';
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
    const data = {
      email,
      password,
      passwordConfirm,
      full_name: fullName,
      phone_number: phoneNumber,
      agent_code: generateAgentCode(),
      location: '', // Will be filled during full registration
      national_id: '', // Will be filled during full registration
      online_status: false,
      earnings: 0
    };
    
    const record = await pb.collection('agents').create(data);
    await pb.collection('agents').authWithPassword(email, password);
    return { success: true, data: record };
  } catch (error: any) {
    console.error('Error signing up agent:', error);
    return { success: false, error: error.message || 'Failed to sign up' };
  }
};

export const signInAgent = async (email: string, password: string) => {
  try {
    const authData = await pb.collection('agents').authWithPassword(email, password);
    return { success: true, data: authData };
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
    const data = {
      email,
      password,
      passwordConfirm,
      full_name: fullName,
      phone_number: phoneNumber,
      address,
    };
    
    const record = await pb.collection('customers').create(data);
    await pb.collection('customers').authWithPassword(email, password);
    return { success: true, data: record };
  } catch (error: any) {
    console.error('Error signing up customer:', error);
    return { success: false, error: error.message || 'Failed to sign up' };
  }
};

export const signInCustomer = async (email: string, password: string) => {
  try {
    const authData = await pb.collection('customers').authWithPassword(email, password);
    return { success: true, data: authData };
  } catch (error: any) {
    console.error('Error signing in customer:', error);
    return { success: false, error: error.message || 'Failed to sign in' };
  }
};

// Common authentication functions
export const signOut = () => {
  pb.authStore.clear();
};

export const refreshSession = async () => {
  try {
    // PocketBase automatically handles token refresh when making authenticated requests
    if (pb.authStore.isValid) {
      return { success: true };
    }
    return { success: false, error: 'No active session' };
  } catch (error: any) {
    console.error('Error refreshing session:', error);
    return { success: false, error: error.message || 'Failed to refresh session' };
  }
};

// Helper function to generate agent code
const generateAgentCode = () => {
  return 'AG' + Math.floor(100000 + Math.random() * 900000).toString();
};
