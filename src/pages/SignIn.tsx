
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import AuthLayout from '@/components/layout/AuthLayout';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const captchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load CAPTCHA script when component mounts
    const loadCaptchaScript = () => {
      if (window.turnstile) {
        renderCaptcha();
        return;
      }

      const script = document.createElement('script');
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => renderCaptcha();
      document.head.appendChild(script);
    };

    loadCaptchaScript();

    return () => {
      // Clean up on unmount if needed
      if (widgetId && window.turnstile) {
        window.turnstile.reset(widgetId);
      }
    };
  }, []);

  const renderCaptcha = () => {
    if (!captchaRef.current || !window.turnstile) return;

    const id = window.turnstile.render(captchaRef.current, {
      sitekey: "0x4AAAAAAAFF14mVA6pRk7b", // Cloudflare Turnstile Supabase site key
      callback: function(token: string) {
        setCaptchaToken(token);
      },
      "expired-callback": function() {
        setCaptchaToken(null);
      }
    });
    
    setWidgetId(id);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA verification');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }, {
        captchaToken: captchaToken,
      });

      if (error) {
        toast.error(error.message);
        // Reset captcha on error
        if (widgetId && window.turnstile) {
          window.turnstile.reset(widgetId);
          setCaptchaToken(null);
        }
        return;
      }

      if (!data.user) {
        toast.error('Login failed');
        return;
      }

      // Check if the user has completed agent registration
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();
        
      if (agentError) {
        console.error('Error checking agent status:', agentError);
      }
      
      if (!agentData) {
        // User hasn't completed agent registration
        toast.info('Please complete your agent profile');
        navigate('/agent-registration');
        return;
      }

      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error('An error occurred during sign in');
      // Reset captcha on error
      if (widgetId && window.turnstile) {
        window.turnstile.reset(widgetId);
        setCaptchaToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your credentials to sign in"
    >
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link 
              to="/forgot-password" 
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>CAPTCHA Verification</Label>
          <div ref={captchaRef} className="flex justify-center my-4"></div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-11"
          disabled={isLoading || !captchaToken}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
