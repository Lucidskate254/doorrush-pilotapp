
import { supabase } from '@/integrations/supabase/client';

/**
 * Uploads an agent profile picture to Supabase storage
 */
export const uploadProfilePicture = async (
  userId: string,
  profilePicture: File
): Promise<string | null> => {
  try {
    // Upload profile picture
    const fileExt = profilePicture.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('agent_profiles')
      .upload(filePath, profilePicture);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get public URL for the uploaded image
    const { data: urlData } = supabase.storage
      .from('agent_profiles')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return null;
  }
};

/**
 * Generates a unique agent code
 */
export const generateAgentCode = (): string => {
  return `AG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};
