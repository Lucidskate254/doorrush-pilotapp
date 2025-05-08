
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb } from '@/integrations/pocketbase/client';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      // Check if the user is already logged in
      if (pb.authStore.isValid) {
        setUser(pb.authStore.model);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    // Initial auth check
    checkAuth();

    // Listen for auth state changes
    pb.authStore.onChange((token, model) => {
      setUser(model);
      setLoading(false);
    });
  }, []);

  const signOut = async () => {
    pb.authStore.clear();
    navigate('/signin');
  };

  return {
    user,
    loading,
    signOut,
    isAuthenticated: pb.authStore.isValid
  };
};
