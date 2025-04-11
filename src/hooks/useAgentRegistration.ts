
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getAgentByUserId, saveAgentData } from '@/services/agentService';

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

  // Initialize with data from auth session
  useEffect(() => {
    const initializeUserId = async () => {
      setIsInitializing(true);
      try {
        // First check if we have data from sign-up process in sessionStorage
        const storedSignupData = sessionStorage.getItem('agentSignupData');
        let signupData = null;
        
        if (storedSignupData) {
          signupData = JSON.parse(storedSignupData);
          setUserId(signupData.userId);
          if (signupData.fullName) setFullName(signupData.fullName);
          if (signupData.phoneNumber) setPhoneNumber(signupData.phoneNumber);
        } else {
          // If no stored data, check if user is authenticated
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            toast.error('Authentication required');
            navigate('/signin');
            return;
          }
          
          const userId = user.id;
          setUserId(userId);
          
          // Try to get user metadata
          if (user.user_metadata) {
            const { full_name, phone_number } = user.user_metadata;
            if (full_name) setFullName(full_name);
            if (phone_number) setPhoneNumber(phone_number);
          }
        }
        
        // If we have a userId, check if agent record exists
        if (userId) {
          try {
            const agent = await getAgentByUserId(userId);
            
            // If agent exists and has a profile_picture, they've completed full registration
            if (agent?.profile_picture) {
              toast.success('Your profile is already completed');
              navigate('/dashboard');
              return;
            }
            
            // If agent exists but hasn't completed full registration, prefill the available data
            if (agent) {
              if (agent.full_name) setFullName(agent.full_name);
              if (agent.phone_number) setPhoneNumber(agent.phone_number);
              if (agent.national_id) setNationalId(agent.national_id);
              if (agent.location) setLocation(agent.location);
            }
          } catch (error) {
            console.error('Error checking agent record:', error);
          }
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
    
    if (!profilePicture) {
      toast.error('Please upload a profile picture');
      return;
    }
    
    // Get current user ID from auth or stored data
    let userIdForSubmit = userId;
    if (!userIdForSubmit) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Authentication required');
        navigate('/signin');
        return;
      }
      userIdForSubmit = user.id;
    }
    
    setIsLoading(true);
    
    try {
      await saveAgentData(userIdForSubmit, {
        fullName,
        phoneNumber,
        nationalId,
        location,
        profilePicture
      });
      
      // Clear the sessionStorage after successful registration
      sessionStorage.removeItem('agentSignupData');
      
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
