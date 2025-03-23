
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
  // Mock data - in a real app would come from API/Supabase
  const [agentData, setAgentData] = useState({
    fullName: "John Doe",
    phoneNumber: "0712345678",
    nationalId: "12345678",
    location: "Eldoret CBD",
    agentCode: "AG-1234567",
    profilePicture: "",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...agentData });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would update the profile in Supabase
    // For now just update our local state
    setAgentData({ ...formData });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
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
                    <AvatarImage src={profilePreview || agentData.profilePicture} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {getInitials(agentData.fullName)}
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
                      disabled={!isEditing}
                      required
                    />
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
                    setFormData({ ...agentData });
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
