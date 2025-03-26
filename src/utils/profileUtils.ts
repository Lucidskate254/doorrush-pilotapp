
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  location: string;
  agentCode: string;
  profilePicture: string;
}

export const maskNationalId = (id: string) => {
  if (!id) return '';
  return id.length > 3 ? `******${id.slice(-3)}` : id;
};

export const initializeFormData = (agentData: Tables<'agents'> | null): ProfileFormData => {
  return {
    fullName: agentData?.full_name || '',
    phoneNumber: agentData?.phone_number || '',
    nationalId: maskNationalId(agentData?.national_id || ''),
    location: agentData?.location || '',
    agentCode: agentData?.agent_code || '',
    profilePicture: agentData?.profile_picture || '',
  };
};

export const updateProfileData = async (
  agentId: string,
  formData: ProfileFormData,
  profilePicture: File | null,
  agentData: Tables<'agents'> | null
) => {
  try {
    let profilePictureUrl = agentData?.profile_picture;

    // If new profile picture uploaded, store it in Supabase storage
    if (profilePicture) {
      const fileExt = profilePicture.name.split('.').pop();
      const filePath = `${agentId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('agent_profiles')
        .upload(filePath, profilePicture);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from('agent_profiles')
        .getPublicUrl(filePath);
        
      profilePictureUrl = urlData.publicUrl;
    }
    
    // Update agent info in Supabase
    const { error } = await supabase
      .from('agents')
      .update({
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        location: formData.location,
        profile_picture: profilePictureUrl,
      })
      .eq('id', agentId);
      
    if (error) {
      throw error;
    }
    
    toast.success("Profile updated successfully");
    return true;
  } catch (error: any) {
    console.error('Error updating profile:', error);
    toast.error(error.message || 'Failed to update profile');
    return false;
  }
};
