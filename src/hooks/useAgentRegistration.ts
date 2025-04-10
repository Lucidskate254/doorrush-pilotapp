
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useAgentRegistration = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Get userId directly from auth session and prefill data if available
  useEffect(() => {
    const initializeUserId = async () => {
      setIsInitializing(true);
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error('Authentication required');
          navigate('/signin');
          return;
        }
        
        const userId = user.id;
        setUserId(userId);
        
        // Check if agent record exists and has complete profile
        const { data: agent, error: agentError } = await supabase
          .from('agents')
          .select('id, full_name, phone_number, national_id, location')
          .eq('id', userId)
          .maybeSingle();
          
        if (agentError) {
          console.error('Error checking agent record:', agentError);
          toast.error('Error checking agent status');
          return;
        }
        
        // If agent exists and has a national_id and location, they've completed full registration
        if (agent?.national_id && agent?.location) {
          toast.success('Your profile is already completed');
          navigate('/dashboard');
          return;
        }
        
        // If agent exists but hasn't completed full registration, prefill the available data
        if (agent) {
          if (agent.full_name) setFullName(agent.full_name);
          if (agent.phone_number) setPhoneNumber(agent.phone_number);
        }

        // If we have user metadata, try to use that to prefill data as well
        if (user.user_metadata) {
          const { full_name, phone_number } = user.user_metadata;
          if (full_name && !fullName) setFullName(full_name);
          if (phone_number && !phoneNumber) setPhoneNumber(phone_number);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/signin');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeUserId();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nationalId || !location || !profilePicture) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Get current user ID from auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Authentication required');
      navigate('/signin');
      return;
    }
    
    const userIdForSubmit = user.id;
    
    setIsLoading(true);
    
    try {
      // Upload profile picture
      const fileExt = profilePicture.name.split('.').pop();
      const filePath = `${userIdForSubmit}/${Date.now()}.${fileExt}`;
      
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
      
      // Update agent data
      const { error: updateError } = await supabase
        .from('agents')
        .update({
          national_id: nationalId,
          location: location,
          profile_picture: urlData.publicUrl,
        })
        .eq('id', userIdForSubmit);
        
      if (updateError) {
        throw updateError;
      }
      
      toast.success('Registration completed successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error completing agent registration:', error);
      toast.error(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
    nationalId,
    setNationalId,
    location,
    setLocation,
    profilePicture,
    profilePreview,
    isLoading,
    userId,
    isInitializing,
    handleFileChange,
    handleSubmit
  };
};
