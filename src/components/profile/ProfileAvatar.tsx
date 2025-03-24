
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface ProfileAvatarProps {
  fullName: string;
  profilePicture: string;
  profilePreview: string | null;
  isEditing: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  fullName,
  profilePicture,
  profilePreview,
  isEditing,
  handleFileChange
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profilePreview || profilePicture} />
        <AvatarFallback className="text-lg bg-primary text-primary-foreground">
          {getInitials(fullName)}
        </AvatarFallback>
      </Avatar>
      
      {isEditing && (
        <div className="w-full">
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
