
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Clock, MapPin, Package } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const DeliveryFAQs = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("delivery-times");

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery FAQs</h1>
          <p className="text-muted-foreground mt-2">
            Find answers to the most common questions about deliveries
          </p>
        </div>

        {/* Contact support card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-card to-card/90">
            <CardHeader>
              <CardTitle>Need urgent delivery assistance?</CardTitle>
              <CardDescription>Contact our delivery support team directly</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="flex gap-2 items-center">
                <Mail className="h-4 w-4" />
                <span>ryanemunyasa@gmail.com</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category selection */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              variant={expandedCategory === "delivery-times" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setExpandedCategory("delivery-times")}
            >
              <Clock className="mr-2 h-4 w-4" />
              Delivery Times
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              variant={expandedCategory === "order-tracking" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setExpandedCategory("order-tracking")}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Order Tracking
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant={expandedCategory === "handling-orders" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setExpandedCategory("handling-orders")}
            >
              <Package className="mr-2 h-4 w-4" />
              Handling Orders
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              variant={expandedCategory === "payment-options" ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setExpandedCategory("payment-options")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Payment Options
            </Button>
          </motion.div>
        </div>

        {/* FAQ accordion cards */}
        <div className="space-y-6">
          {/* Delivery Times FAQs */}
          {expandedCategory === "delivery-times" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Delivery Times
                  </CardTitle>
                  <CardDescription>Common questions about delivery timeframes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How long does a typical delivery take?</AccordionTrigger>
                      <AccordionContent>
                        Standard deliveries typically take 30-45 minutes, depending on distance, traffic conditions, 
                        and order complexity. During peak hours, deliveries may take 45-60 minutes. You can 
                        track your delivery in real-time through the app.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>What are DoorRush's delivery hours?</AccordionTrigger>
                      <AccordionContent>
                        DoorRush operates from 7:00 AM to 10:00 PM daily. However, specific delivery 
                        hours may vary by location and merchant availability. You can check merchant 
                        hours in the app before placing an order.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>How are delivery times estimated?</AccordionTrigger>
                      <AccordionContent>
                        Delivery time estimates are calculated based on the distance between the merchant 
                        and delivery location, current traffic conditions, the time it takes to prepare the 
                        order, and agent availability in your area.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger>What if my delivery is late?</AccordionTrigger>
                      <AccordionContent>
                        If your delivery is significantly delayed beyond the estimated time, you'll 
                        receive an update through the app. For substantial delays, contact customer 
                        support, who may offer compensation such as delivery fee refunds or discount codes.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Order Tracking FAQs */}
          {expandedCategory === "order-tracking" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Order Tracking
                  </CardTitle>
                  <CardDescription>Common questions about tracking your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How can I track my order?</AccordionTrigger>
                      <AccordionContent>
                        You can track your order in real-time through the DoorRush app. After an order 
                        is confirmed, you'll see the order status update as it progresses from preparation 
                        to pickup to delivery. You'll also be able to see your delivery agent's location on the map.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Why isn't my tracking map updating?</AccordionTrigger>
                      <AccordionContent>
                        If the tracking map isn't updating, try refreshing the app. This could be due to 
                        connectivity issues with either your device or the delivery agent's device. If the 
                        problem persists, contact customer support for assistance.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Can I share my order tracking with someone else?</AccordionTrigger>
                      <AccordionContent>
                        Yes, you can share your order tracking details with others. In the order 
                        tracking screen, look for the "Share" button, which allows you to send a 
                        tracking link via SMS, email, or other messaging apps.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger>What do the different status updates mean?</AccordionTrigger>
                      <AccordionContent>
                        "Order Received" means your order has been accepted by the merchant.
                        "Preparing" means the merchant is preparing your order.
                        "Ready for Pickup" means your order is ready and waiting for an agent.
                        "Picked Up" means the agent has collected your order and is on their way.
                        "Arriving Soon" means the agent is approaching your delivery location.
                        "Delivered" means your order has been successfully delivered.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Handling Orders FAQs */}
          {expandedCategory === "handling-orders" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    Handling Orders
                  </CardTitle>
                  <CardDescription>Common questions about order handling during delivery</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How should agents handle food deliveries?</AccordionTrigger>
                      <AccordionContent>
                        Agents should use insulated bags to maintain food temperature during transport.
                        Food items must be kept level to prevent spills. Agents should verify order completeness 
                        at pickup and handle all food containers with clean hands. Sealed packages should never be opened.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>What's the protocol for "contactless delivery"?</AccordionTrigger>
                      <AccordionContent>
                        For contactless deliveries, agents should place the order at the specified drop-off 
                        location, take a photo as proof of delivery, and then step back at least 2 meters before 
                        notifying the customer. Wait briefly to ensure the customer receives the order, then mark
                        it as delivered in the app.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>What should I do if the customer isn't available?</AccordionTrigger>
                      <AccordionContent>
                        If a customer isn't available, follow these steps: 1) Call the customer using the in-app 
                        calling feature; 2) If no answer, wait for 5 minutes; 3) Contact DoorRush support through 
                        the app for guidance; 4) Follow support instructions for either leaving the order in a safe 
                        place with photo evidence or returning the items.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger>How do I verify the delivery has been completed?</AccordionTrigger>
                      <AccordionContent>
                        To verify delivery completion, scan the QR code in the app when the customer receives the 
                        order. For contactless deliveries, take a clear photo showing the order at the drop-off 
                        location. Once verified, mark the order as "Delivered" in the app, which will notify the customer 
                        and complete the delivery process.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Payment Options FAQs */}
          {expandedCategory === "payment-options" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="mr-2 h-5 w-5" />
                    Payment Options
                  </CardTitle>
                  <CardDescription>Common questions about payment methods for customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                      <AccordionContent>
                        DoorRush accepts multiple payment methods including Mobile Money (M-Pesa, Airtel Money), 
                        credit/debit cards, and cash on delivery. Agents should be prepared to handle all these 
                        payment methods and provide change for cash payments when necessary.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How do agents handle cash payments?</AccordionTrigger>
                      <AccordionContent>
                        When handling cash payments, agents should: 1) Confirm the exact amount due with the 
                        customer; 2) Accept payment and provide change if needed; 3) Mark the order as "Paid" 
                        in the app; 4) Offer a receipt if requested. Agents are responsible for all cash 
                        collected until it's deposited to DoorRush.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger>What if a customer disputes a payment?</AccordionTrigger>
                      <AccordionContent>
                        If a customer disputes a payment, remain calm and professional. Verify the order details and 
                        payment amount in the app. If there's a discrepancy, contact DoorRush support immediately 
                        for guidance. Never engage in arguments with customers over payment issues.
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger>Can customers tip agents through the app?</AccordionTrigger>
                      <AccordionContent>
                        Yes, customers can tip agents either through the app or in cash. App tips are added 
                        to the agent's earnings and paid out according to the regular payment schedule. 
                        Cash tips can be kept immediately. Always thank customers for their tips, but never 
                        request or suggest tipping.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DeliveryFAQs;
