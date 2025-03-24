
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ELDORET_TOWNS } from '@/constants/locations';

interface AgentRegistrationFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  nationalId: string;
  setNationalId: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  profilePreview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const AgentRegistrationForm: React.FC<AgentRegistrationFormProps> = ({
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  nationalId,
  setNationalId,
  location,
  setLocation,
  profilePreview,
  handleFileChange,
  handleSubmit,
  isLoading
}) => {
  return (
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
            {ELDORET_TOWNS.map((town) => (
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
  );
};

export default AgentRegistrationForm;
