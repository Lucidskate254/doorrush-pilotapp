
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { supabase } from '@/integrations/supabase/client';

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
  const [formData, setFormData] = useState({
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
      setFormData({
        fullName: agentData.full_name,
        phoneNumber: agentData.phone_number,
        nationalId: maskNationalId(agentData.national_id),
        location: agentData.location,
        agentCode: agentData.agent_code,
        profilePicture: agentData.profile_picture || '',
      });
    }
  }, [agentData]);

  // Mask National ID (show only last 3 digits)
  const maskNationalId = (id: string) => {
    if (!id) return '';
    return id.length > 3 ? `******${id.slice(-3)}` : id;
  };
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agentData?.id) {
      toast.error("User ID not available");
      return;
    }

    try {
      let profilePictureUrl = agentData.profile_picture;

      // If new profile picture uploaded, store it in Supabase storage
      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop();
        const filePath = `${agentData.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('agent_profiles')
          .upload(filePath, profilePicture);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: urlData } = supabase.storage
          .from('agent_profiles')
          .getPublicUrl(filePath);
          
        profilePictureUrl = urlData.publicUrl;
      }
      
      // Update agent info in Supabase
      const { error } = await supabase
        .from('agents')
        .update({
          full_name: formData.fullName,
          phone_number: formData.phoneNumber,
          location: formData.location,
          profile_picture: profilePictureUrl,
        })
        .eq('id', agentData.id);
        
      if (error) {
        throw error;
      }
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
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
                <div className="flex flex-col items-center justify-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profilePreview || formData.profilePicture} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {getInitials(formData.fullName)}
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
                          {TOWNS.map((town) => (
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
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 border-t bg-muted/20 p-6">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    if (agentData) {
                      setFormData({
                        fullName: agentData.full_name,
                        phoneNumber: agentData.phone_number,
                        nationalId: maskNationalId(agentData.national_id),
                        location: agentData.location,
                        agentCode: agentData.agent_code,
                        profilePicture: agentData.profile_picture || '',
                      });
                    }
                    setProfilePreview(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" form="profile-form">
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;
