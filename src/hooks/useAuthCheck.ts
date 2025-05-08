
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '@/integrations/pocketbase/client';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState<any>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);
        
        // Check if the user is authenticated
        if (!pb.authStore.isValid) {
          navigate('/signin');
          return;
        }
        
        const userId = pb.authStore.model?.id;
        if (!userId) {
          navigate('/signin');
          return;
        }
        
        setUserId(userId);
        
        // Check if the authenticated user is an agent
        if (pb.authStore.model?.collectionName === 'agents') {
          try {
            const agentData = await pb.collection('agents').getOne(userId);
            
            // If agent has no full name or incomplete profile, redirect to registration
            if (!agentData.full_name || agentData.full_name === '' || 
                !agentData.national_id || agentData.national_id === '' || 
                !agentData.location || agentData.location === '') {
              navigate('/agent-registration');
              return;
            } else {
              setAgentData(agentData);
            }
          } catch (error) {
            console.error('Error fetching agent data:', error);
          }
        } else {
          // Not an agent, redirect to sign in
          navigate('/signin');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();

    // Listen for auth changes
    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (!token) {
        navigate('/signin');
      }
    });

    return () => {
      // Cleanup
    };
  }, [navigate]);

  return { userId, isLoading, agentData };
};
