
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
        
        // Get current session
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
        } else if (!agentData) {
          // If user is authenticated but has no agent profile, redirect to complete registration
          navigate('/agent-registration');
          return;
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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUserId(null);
          setAgentData(null);
          navigate('/signin');
        } else if (session) {
          setUserId(session.user.id);
          // Refresh agent data on auth state change
          checkAuthentication();
        }
      }
    );

    checkAuthentication();

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { userId, isLoading, agentData };
};
