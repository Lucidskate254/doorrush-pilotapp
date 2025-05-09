
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DollarSign, MapPin, Package, User } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from 'sonner';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import './ripple-button.css';

const Dashboard = () => {
  const { agentData, isLoading } = useAuthCheck();
  const [isOnline, setIsOnline] = useState(false);
  
  const handleOnlineStatusChange = async (checked: boolean) => {
    setIsOnline(checked);
    
    if (agentData) {
      // Update agent's online status in the database
      const { error } = await supabase
        .from('agents')
        .update({ online_status: checked })
        .eq('id', agentData.id);
        
      if (error) {
        console.error('Error updating online status:', error);
        toast.error('Failed to update status');
        setIsOnline(!checked); // Revert the UI state
      } else {
        toast.success(`You are now ${checked ? 'online' : 'offline'}`);
      }
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </div>
            <Skeleton className="w-full md:w-32 h-12" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          
          <Skeleton className="h-64" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {agentData?.full_name || 'Agent'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Profile picture with circular animation */}
            <Link to="/profile" className="relative group">
              <div className="absolute inset-0 bg-primary rounded-full opacity-20 group-hover:opacity-30 transition-opacity animate-pulse"></div>
              <div className="absolute -inset-1 rounded-full bg-primary opacity-0 group-hover:opacity-20 animate-ping"></div>
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage 
                  src={agentData?.profile_picture || ''} 
                  alt={agentData?.full_name || 'Agent profile'} 
                />
                <AvatarFallback>
                  {(agentData?.full_name || 'A').charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <Card className="w-full md:w-auto">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="ripple-button-container">
                    <Switch
                      id="online-mode"
                      checked={isOnline}
                      onCheckedChange={handleOnlineStatusChange}
                      className="ripple-button"
                    />
                  </div>
                  <Label htmlFor="online-mode" className="font-medium">
                    {isOnline ? 'Online' : 'Offline'}
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  KES {agentData?.earnings ? agentData.earnings.toLocaleString() : '0.00'}
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
                <CardTitle className="text-2xl">{agentData?.agent_code || 'N/A'}</CardTitle>
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
                <CardTitle className="text-2xl">{agentData?.location || 'Not set'}</CardTitle>
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
                <CardTitle className="text-2xl">
                  {/* This would normally come from a count of completed orders */}
                  {/* For now, showing 0 for new agents */}
                  0
                </CardTitle>
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
