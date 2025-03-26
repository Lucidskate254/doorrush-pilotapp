
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileActionsProps {
  isEditing: boolean;
  onCancel: () => void;
  onEdit: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isEditing,
  onCancel,
  onEdit
}) => {
  return (
    <>
      {isEditing ? (
        <>
          <Button 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" form="profile-form">
            Save Changes
          </Button>
        </>
      ) : (
        <Button onClick={onEdit}>
          Edit Profile
        </Button>
      )}
    </>
  );
};

export default ProfileActions;
