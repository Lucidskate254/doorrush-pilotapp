
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const DeliverySuccess = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            duration: 0.6 
          }}
          className="text-green-500 mb-6"
        >
          <CheckCircle className="h-32 w-32" strokeWidth={1.5} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-center mb-4"
        >
          Delivery Successful!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-lg text-muted-foreground text-center mb-8 max-w-md"
        >
          You have successfully completed this delivery. The customer has been notified.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex gap-4"
        >
          <Button 
            variant="default" 
            size="lg" 
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DeliverySuccess;
