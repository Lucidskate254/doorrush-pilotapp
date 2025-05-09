
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';

const HelpCenter = () => {
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions and get help with your DoorRush experience
          </p>
        </div>

        {/* Quick access support card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-card to-card/90">
            <CardHeader>
              <CardTitle>Need urgent help?</CardTitle>
              <CardDescription>Contact our support team directly</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Button variant="outline" className="flex gap-2 items-center">
                <Phone className="h-4 w-4" />
                <span>+254 758 301 710</span>
              </Button>
              <Button variant="outline" className="flex gap-2 items-center">
                <Mail className="h-4 w-4" />
                <span>ryanemunyasa@gmail.com</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {/* For Customers */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border border-border/50 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>For Customers</CardTitle>
                <CardDescription>Help with orders and delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  • How to place an order
                </p>
                <p className="text-sm">
                  • Tracking your delivery
                </p>
                <p className="text-sm">
                  • Payment options
                </p>
                <p className="text-sm">
                  • Cancellations and refunds
                </p>
                <Button variant="outline" className="w-full mt-4">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* For Delivery Agents */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border border-border/50 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>For Delivery Agents</CardTitle>
                <CardDescription>Assistance for our delivery partners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  • Account management
                </p>
                <p className="text-sm">
                  • Delivery app troubleshooting
                </p>
                <p className="text-sm">
                  • Payment and earnings
                </p>
                <p className="text-sm">
                  • Safety guidelines
                </p>
                <Button variant="outline" className="w-full mt-4">
                  <Link to="/agent-guidelines">View Guidelines</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* For Merchants */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border border-border/50 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>For Merchants</CardTitle>
                <CardDescription>Help for business partners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  • Setting up your store
                </p>
                <p className="text-sm">
                  • Managing orders
                </p>
                <p className="text-sm">
                  • Payment processing
                </p>
                <p className="text-sm">
                  • Business reports
                </p>
                <Button variant="outline" className="w-full mt-4">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Common Issues */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border border-border/50 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
                <CardDescription>Resolve common issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  • App not working properly
                </p>
                <p className="text-sm">
                  • Location services issues
                </p>
                <p className="text-sm">
                  • Payment failures
                </p>
                <p className="text-sm">
                  • Account access problems
                </p>
                <Button variant="outline" className="w-full mt-4">
                  View Solutions
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQs */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border border-border/50 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Delivery FAQs</CardTitle>
                <CardDescription>Common delivery questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  • Delivery times
                </p>
                <p className="text-sm">
                  • Tracking orders
                </p>
                <p className="text-sm">
                  • Handling issues
                </p>
                <p className="text-sm">
                  • Special delivery requests
                </p>
                <Button variant="outline" className="w-full mt-4">
                  <Link to="/delivery-faqs">View FAQs</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Us */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border border-border/50 transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Get in touch with our team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  • Email: ryanemunyasa@gmail.com
                </p>
                <p className="text-sm">
                  • Phone: +254 758 301 710
                </p>
                <p className="text-sm">
                  • Alt. Phone: +254 780 028 064
                </p>
                <p className="text-sm">
                  • Location: Eldoret, Kenya
                </p>
                <Button variant="outline" className="w-full mt-4">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default HelpCenter;
