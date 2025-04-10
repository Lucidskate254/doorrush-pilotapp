
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import AuthLayout from '@/components/layout/AuthLayout';
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !fullName || !phoneNumber) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, check if user already exists
      const { data: existingUser } = await supabase
        .from('agents')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        toast.error('An account with this email already exists');
        setIsLoading(false);
        return;
      }

      // Sign up the user with authentication
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_agent: true,
            full_name: fullName,
            phone_number: phoneNumber
          }
        }
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        toast.error('Failed to create account');
        setIsLoading(false);
        return;
      }

      const userId = data.user.id;

      // Create a basic agent record with the required fields
      const { error: agentError } = await supabase
        .from('agents')
        .insert({
          id: userId,
          user_id: userId,
          email: email,
          full_name: fullName,
          phone_number: phoneNumber,
          national_id: '', // Will be filled during complete registration
          location: '', // Will be filled during complete registration
          agent_code: 'AG-' + Math.random().toString(36).substring(2, 9).toUpperCase() // Generate a unique agent code
        });
      
      if (agentError) {
        console.error('Error creating agent record:', agentError);
        // Don't log out the user since they've already signed up
        toast.error('Failed to create agent profile. Please continue to registration.');
      }
      
      // Store this data in sessionStorage to be used in the registration page
      sessionStorage.setItem('agentSignupData', JSON.stringify({
        userId,
        fullName,
        phoneNumber,
        email
      }));
      
      toast.success('Account created successfully! Please complete your registration to continue.');
      navigate('/agent-registration');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error('An error occurred during sign up');
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
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="07XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
        
        <Button 
          type="submit" 
          className="w-full h-11"
          disabled={isLoading}
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
