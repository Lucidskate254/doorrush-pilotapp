
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import AuthLayout from '@/components/layout/AuthLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Eldoret-based towns
const TOWNS = [
  'Eldoret CBD',
  'Action',
  'Kapsoya',
  'Langas',
  'Kimumu',
  'Pioneer',
  'Annex',
  'Elgon View',
  'West Indies',
  'Kahoya',
  'Mwanzo',
  'Huruma',
];

const AgentRegistration = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [location, setLocation] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!fullName || !phoneNumber || !nationalId || !location || !profilePicture) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulating an API call
    setTimeout(() => {
      // In a real implementation, this would upload to Supabase storage
      // and save data to the Agents table
      toast.success('Registration successful');
      navigate('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Become an Agent" 
      subtitle="Complete your profile to start delivering"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
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
            placeholder="07XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nationalId">National ID Number</Label>
          <Input
            id="nationalId"
            placeholder="XXXXXXXX"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            required
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={setLocation} required>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {TOWNS.map((town) => (
                <SelectItem key={town} value={town}>
                  {town}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <div className="flex flex-col items-center gap-4">
            {profilePreview && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border">
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <Input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!profilePreview}
              className="h-11"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-11"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Complete Registration"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AgentRegistration;
