
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

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!captchaToken) {
      toast.error('Please complete the CAPTCHA verification');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
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

      if (data?.user) {
        toast.success('Account created successfully');
        // Store user ID in session storage to retrieve it during agent registration
        sessionStorage.setItem('userId', data.user.id);
        navigate('/agent-registration');
      } else {
        toast.error('Failed to create account');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error('An error occurred during sign up');
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
      title="Create an account" 
      subtitle="Enter your details to get started"
    >
      <form onSubmit={handleSignUp} className="space-y-4">
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
          <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
