
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileFormFields from '@/components/profile/ProfileFormFields';
import ProfileActions from '@/components/profile/ProfileActions';
import { ProfileFormData, initializeFormData, updateProfileData } from '@/utils/profileUtils';

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

const Profile = () => {
  const { agentData, isLoading } = useAuthCheck();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    phoneNumber: '',
    nationalId: '',
    location: '',
    agentCode: '',
    profilePicture: '',
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  
  // Initialize form data when agent data is loaded
  React.useEffect(() => {
    if (agentData) {
      setFormData(initializeFormData(agentData));
    }
  }, [agentData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleLocationChange = (value: string) => {
    setFormData({ ...formData, location: value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    if (agentData) {
      setFormData(initializeFormData(agentData));
    }
    setProfilePreview(null);
    setProfilePicture(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agentData?.id) {
      toast.error("User ID not available");
      return;
    }

    const success = await updateProfileData(
      agentData.id,
      formData,
      profilePicture,
      agentData
    );
    
    if (success) {
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Loading profile information...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your agent profile information
          </p>
        </div>
        
        <Card className="overflow-hidden border border-border/50">
          <CardHeader className="pb-4">
            <CardTitle>Agent Information</CardTitle>
            <CardDescription>
              View and update your personal information
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} id="profile-form">
              <div className="grid gap-6">
                <ProfileAvatar
                  fullName={formData.fullName}
                  profilePicture={formData.profilePicture}
                  profilePreview={profilePreview}
                  isEditing={isEditing}
                  handleFileChange={handleFileChange}
                />
                
                <ProfileFormFields
                  formData={formData}
                  handleChange={handleChange}
                  handleLocationChange={handleLocationChange}
                  isEditing={isEditing}
                  towns={TOWNS}
                />
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 border-t bg-muted/20 p-6">
            <ProfileActions
              isEditing={isEditing}
              onCancel={handleCancel}
              onEdit={() => setIsEditing(true)}
            />
          </CardFooter>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;
