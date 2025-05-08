
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { pb } from '@/integrations/pocketbase/client';
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
          if (!pb.authStore.isValid) {
            toast.error('Authentication required');
            navigate('/signin');
            return;
          }
          
          const userId = pb.authStore.model?.id;
          if (!userId) {
            toast.error('Authentication required');
            navigate('/signin');
            return;
          }
          
          setUserId(userId);
          
          // Try to get user metadata
          if (pb.authStore.model) {
            const { full_name, phone_number } = pb.authStore.model;
            if (full_name) setFullName(full_name);
            if (phone_number) setPhoneNumber(phone_number);
          }
        }
        
        // If we have a userId, check if agent record exists and is complete
        if (userId) {
          try {
            const agent = await getAgentByUserId(userId);
            
            // If agent exists and has a complete profile, redirect to dashboard
            if (agent?.profile_picture && agent?.national_id && agent?.location) {
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
    
    if (!nationalId || !location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Get current user ID from auth or stored data
    let userIdForSubmit = userId;
    if (!userIdForSubmit) {
      if (!pb.authStore.isValid) {
        toast.error('Authentication required');
        navigate('/signin');
        return;
      }
      userIdForSubmit = pb.authStore.model?.id;
      if (!userIdForSubmit) {
        toast.error('Authentication required');
        navigate('/signin');
        return;
      }
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
