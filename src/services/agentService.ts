
import { pb } from '@/integrations/pocketbase/client';
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
    const record = await pb.collection('agents').getOne(userId);
    return record;
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
    const formData = new FormData();
    formData.append('full_name', data.fullName);
    formData.append('phone_number', data.phoneNumber);
    formData.append('national_id', data.nationalId);
    formData.append('location', data.location);
    
    // Upload profile picture if provided
    if (data.profilePicture) {
      formData.append('profile_picture', data.profilePicture);
    }

    // Update agent data
    await pb.collection('agents').update(userId, formData);
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
    const formData = new FormData();
    formData.append('profile_picture', file);

    const record = await pb.collection('agents').update(userId, formData);
    
    // Return the URL to the uploaded file
    if (record.profile_picture) {
      return `${pb.baseUrl}/api/files/${record.collectionId}/${record.id}/${record.profile_picture}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};
