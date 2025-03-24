
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState<Tables<'agents'> | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          navigate('/signin');
          return;
        }
        
        const userId = data.session.user.id;
        setUserId(userId);
        
        // Fetch agent data if authenticated
        const { data: agentData, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching agent data:', error);
        } else {
          setAgentData(agentData);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  return { userId, isLoading, agentData };
};
