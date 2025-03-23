
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DollarSign, MapPin, Package, User } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'sonner';

const Dashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  
  // Mock data - in a real app would come from API/Supabase
  const agentData = {
    name: "John Doe",
    earnings: 2500.75,
    location: "Eldoret CBD",
    agentCode: "AG-1234567",
    completed: 128,
  };
  
  const handleOnlineStatusChange = (checked: boolean) => {
    setIsOnline(checked);
    toast.success(`You are now ${checked ? 'online' : 'offline'}`);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {agentData.name}
            </p>
          </div>
          
          <Card className="w-full md:w-auto">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="online-mode"
                  checked={isOnline}
                  onCheckedChange={handleOnlineStatusChange}
                />
                <Label htmlFor="online-mode" className="font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden border border-border/50">
              <CardHeader className="pb-2">
                <CardDescription>Total Earnings</CardDescription>
                <CardTitle className="text-2xl flex items-baseline gap-1">
                  KES {agentData.earnings.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <DollarSign className="inline-block h-4 w-4 mr-1" />
                  Available for withdrawal
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="overflow-hidden border border-border/50">
              <CardHeader className="pb-2">
                <CardDescription>Agent Code</CardDescription>
                <CardTitle className="text-2xl">{agentData.agentCode}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <User className="inline-block h-4 w-4 mr-1" />
                  Your unique identifier
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden border border-border/50">
              <CardHeader className="pb-2">
                <CardDescription>Current Location</CardDescription>
                <CardTitle className="text-2xl">{agentData.location}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <MapPin className="inline-block h-4 w-4 mr-1" />
                  Your service area
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="overflow-hidden border border-border/50">
              <CardHeader className="pb-2">
                <CardDescription>Completed Deliveries</CardDescription>
                <CardTitle className="text-2xl">{agentData.completed}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  <Package className="inline-block h-4 w-4 mr-1" />
                  Successful deliveries
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest deliveries and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              No recent activity to display.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
