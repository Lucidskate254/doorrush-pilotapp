
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  const [notifications, setNotifications] = React.useState({
    app: true,
    email: false,
    sms: true,
  });
  
  const [privacy, setPrivacy] = React.useState({
    locationTracking: true,
    dataCollection: true,
  });
  
  const handleNotificationChange = (key: keyof typeof notifications, checked: boolean) => {
    setNotifications({
      ...notifications,
      [key]: checked,
    });
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${checked ? 'enabled' : 'disabled'}`);
  };
  
  const handlePrivacyChange = (key: keyof typeof privacy, checked: boolean) => {
    setPrivacy({
      ...privacy,
      [key]: checked,
    });
    
    const messageMap = {
      locationTracking: 'Location tracking',
      dataCollection: 'Data collection',
    };
    
    toast.success(`${messageMap[key]} ${checked ? 'enabled' : 'disabled'}`);
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
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Card className="overflow-hidden border border-border/50">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications-app">App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications within the app
                </p>
              </div>
              <Switch
                id="notifications-app"
                checked={notifications.app}
                onCheckedChange={(checked) => handleNotificationChange('app', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications-email">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your account
                </p>
              </div>
              <Switch
                id="notifications-email"
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange('email', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications-sms">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive text messages for important updates
                </p>
              </div>
              <Switch
                id="notifications-sms"
                checked={notifications.sms}
                onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border border-border/50">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>
              Manage your privacy and security settings
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location-tracking">Location Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Allow the app to track your location
                </p>
              </div>
              <Switch
                id="location-tracking"
                checked={privacy.locationTracking}
                onCheckedChange={(checked) => handlePrivacyChange('locationTracking', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-collection">Data Collection</Label>
                <p className="text-sm text-muted-foreground">
                  Allow us to collect usage data to improve the app
                </p>
              </div>
              <Switch
                id="data-collection"
                checked={privacy.dataCollection}
                onCheckedChange={(checked) => handlePrivacyChange('dataCollection', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="pt-2">
              <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                This action cannot be undone. Your account will be permanently deleted.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Settings;
