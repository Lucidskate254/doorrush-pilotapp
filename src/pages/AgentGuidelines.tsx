
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Info, Package, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/layout/DashboardLayout';

const AgentGuidelines = () => {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Guidelines</h1>
          <p className="text-muted-foreground mt-2">
            Essential information and best practices for DoorRush delivery agents
          </p>
        </div>

        {/* Contact card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-card to-card/90">
            <CardHeader>
              <CardTitle>Need assistance with these guidelines?</CardTitle>
              <CardDescription>Contact our agent support team directly</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="flex gap-2 items-center">
                <Mail className="h-4 w-4" />
                <span>ryanemunyasa@gmail.com</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Guidelines sections */}
        <div className="space-y-6">
          {/* General Expectations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden border border-border/50">
              <CardHeader className="bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  General Expectations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Professional Conduct</h3>
                  <p className="text-sm text-muted-foreground">
                    As a DoorRush agent, you represent our brand to customers. Always maintain professionalism,
                    wear appropriate attire, and ensure your delivery vehicle is clean and in good condition.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Availability and Scheduling</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the online/offline toggle on your dashboard to indicate your availability. 
                    When online, you're expected to accept delivery requests promptly. If you need to 
                    take a break, switch to offline status.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Communication</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear communication is essential. Keep customers informed about their delivery status,
                    especially if there are delays. Use the app messaging system for all communications to 
                    maintain a record.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Delivery Protocols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="overflow-hidden border border-border/50">
              <CardHeader className="bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Delivery Protocols
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Order Pickup</h3>
                  <p className="text-sm text-muted-foreground">
                    When you arrive at the merchant location, confirm the order details, including 
                    customer information and delivery address. Verify the order is complete and properly packaged.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Safe Handling</h3>
                  <p className="text-sm text-muted-foreground">
                    Handle all items with care. For food deliveries, ensure the packaging remains sealed and
                    food is stored properly during transport. Use insulated bags when appropriate to maintain 
                    food temperature.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Delivery Confirmation</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the QR scanner in the app to confirm delivery. If the customer isn't available,
                    follow the app's instructions for safe drop-off procedures and take a photo as proof 
                    of delivery.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Earnings and Payments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="overflow-hidden border border-border/50">
              <CardHeader className="bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Earnings and Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Payment Structure</h3>
                  <p className="text-sm text-muted-foreground">
                    Your earnings consist of base pay per delivery plus distance-based compensation, 
                    bonuses, and customer tips. Base rates vary by location and may change during peak hours.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Withdrawals</h3>
                  <p className="text-sm text-muted-foreground">
                    You can withdraw your earnings through the app. Standard withdrawals are processed 
                    every Monday, while instant withdrawals are available for a small fee. Ensure your 
                    banking information is accurate in your profile.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Promotions and Bonuses</h3>
                  <p className="text-sm text-muted-foreground">
                    DoorRush offers various bonus opportunities, including peak hour incentives, 
                    consecutive delivery bonuses, and weekly challenges. Check your app regularly for 
                    current promotions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Handling Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="overflow-hidden border border-border/50">
              <CardHeader className="bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Handling Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Order Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    If there's an issue with the order (wrong items, damaged packaging), contact DoorRush 
                    support immediately before leaving the merchant. Do not attempt to check inside sealed packages.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Customer Disputes</h3>
                  <p className="text-sm text-muted-foreground">
                    If a customer claims they didn't receive their order or it was incorrect, remain calm and
                    professional. Direct them to DoorRush customer support and contact agent support to report 
                    the issue from your side.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Safety Concerns</h3>
                  <p className="text-sm text-muted-foreground">
                    Your safety comes first. If you feel unsafe in any situation, remove yourself from the 
                    area and contact DoorRush support immediately. Do not engage in confrontations with 
                    customers or merchants.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AgentGuidelines;
