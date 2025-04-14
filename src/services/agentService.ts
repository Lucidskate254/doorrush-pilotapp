
import { supabase } from '@/integrations/supabase/client';
import { uploadProfilePicture } from '@/utils/agentProfileUtils';

interface AgentData {
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  location: string;
  profilePictureUrl: string;
  userId: string;
}

/**
 * Fetches agent data by userId
 */
export const getAgentByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('agents')
    .select('id, full_name, phone_number, national_id, location, profile_picture')
    .eq('id', userId)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching agent data:', error);
    throw error;
  }
  
  return data;
};

/**
 * Creates or updates an agent record
 */
export const saveAgentData = async (
  userId: string,
  data: {
    fullName: string;
    phoneNumber: string;
    nationalId: string;
    location: string;
    profilePicture: File | null;
  }
): Promise<void> => {
  try {
    // Upload profile picture if provided
    let profilePictureUrl = null;
    if (data.profilePicture) {
      profilePictureUrl = await uploadProfilePicture(userId, data.profilePicture);
      if (!profilePictureUrl) {
        throw new Error('Failed to upload profile picture');
      }
    }

    // Update agent data - the record should already exist from the signup process
    const { error: updateError } = await supabase
      .from('agents')
      .update({
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        national_id: data.nationalId,
        location: data.location,
        profile_picture: profilePictureUrl,
      })
      .eq('id', userId);
      
    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error('Error saving agent data:', error);
    throw error;
  }
};
