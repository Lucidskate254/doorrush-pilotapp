
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileFormData {
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  location: string;
  agentCode: string;
}

interface ProfileFormFieldsProps {
  formData: ProfileFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocationChange: (value: string) => void;
  isEditing: boolean;
  towns: string[];
}

const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({
  formData,
  handleChange,
  handleLocationChange,
  isEditing,
  towns
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="07XXXXXXXX"
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={!isEditing}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="nationalId">National ID</Label>
        <Input
          id="nationalId"
          name="nationalId"
          placeholder="XXXXXXXX"
          value={formData.nationalId}
          onChange={handleChange}
          disabled={true}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          National ID is partially hidden for security
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        {isEditing ? (
          <Select 
            value={formData.location} 
            onValueChange={handleLocationChange}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {towns.map((town) => (
                <SelectItem key={town} value={town}>
                  {town}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id="location"
            value={formData.location}
            disabled
          />
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="agentCode">Agent Code</Label>
        <Input
          id="agentCode"
          value={formData.agentCode}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Agent code cannot be changed
        </p>
      </div>
    </div>
  );
};

export default ProfileFormFields;
