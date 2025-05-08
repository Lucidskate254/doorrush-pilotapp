
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AgentData {
  full_name: string;
  phone_number: string;
  national_id: string;
  location: string;
  profile_picture?: File;
}

/**
 * Fetches agent data by userId
 */
export const getAgentByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching agent data:', error);
    throw error;
  }
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
    const updates = {
      full_name: data.fullName,
      phone_number: data.phoneNumber,
      national_id: data.nationalId,
      location: data.location,
    };

    // First update the basic agent data
    const { error } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;

    // Upload profile picture if provided
    if (data.profilePicture) {
      const filePath = `profile-pictures/${userId}`;
      const { error: uploadError } = await supabase.storage
        .from('agents')
        .upload(filePath, data.profilePicture, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from('agents')
        .getPublicUrl(filePath);

      // Update the agent record with the profile picture URL
      const { error: updateError } = await supabase
        .from('agents')
        .update({
          profile_picture: urlData.publicUrl
        })
        .eq('id', userId);

      if (updateError) throw updateError;
    }
  } catch (error) {
    console.error('Error saving agent data:', error);
    throw error;
  }
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (userId: string, file: File): Promise<string | null> => {
  try {
    const filePath = `profile-pictures/${userId}`;
    const { error: uploadError } = await supabase.storage
      .from('agents')
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('agents')
      .getPublicUrl(filePath);

    // Update the agent record with the profile picture URL
    const { error: updateError } = await supabase
      .from('agents')
      .update({
        profile_picture: urlData.publicUrl
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};
