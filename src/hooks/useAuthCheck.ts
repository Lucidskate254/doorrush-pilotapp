
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [agentData, setAgentData] = useState<any>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          navigate('/signin');
          return;
        }
        
        const userId = session.user.id;
        setUserId(userId);
        
        // Check if the authenticated user is an agent
        const { data: agentData, error: agentError } = await supabase
          .from('agents')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (agentError && agentError.code !== 'PGRST116') { // PGRST116 is "no rows returned" code
          console.error('Error fetching agent data:', agentError);
        }
        
        if (agentData) {
          // If agent has no full name or incomplete profile, redirect to registration
          if (!agentData.full_name || 
              !agentData.national_id || 
              !agentData.location) {
            navigate('/agent-registration');
            return;
          } else {
            setAgentData(agentData);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/signin');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { userId, isLoading, agentData };
};
