
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, UserCheck, ChevronRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // Card animation variants
  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: 'easeOut'
      }
    })
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        style={{
          backgroundImage: `url('/lovable-uploads/db1b1bef-284d-4de2-8b65-e7260f14efdc.png'), linear-gradient(135deg, #1a365d 0%, #2563eb 100%)`,
          backgroundSize: '500px, cover',
          backgroundBlendMode: 'overlay',
          filter: 'brightness(0.7)'
        }}
      />

      {/* Animated circles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-md"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            DoorRush
            <span className="text-blue-300">Pilot</span>
          </h1>
          <motion.p 
            className="text-xl text-blue-100 max-w-2xl mx-auto"
            animate={{ opacity: [0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            The ultimate delivery management solution for delivery agents
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          {[
            {
              title: "Manage Orders",
              description: "Accept and manage delivery orders efficiently",
              icon: <Package className="h-12 w-12 text-blue-400" />,
              action: () => navigate('/orders'),
              index: 0
            },
            {
              title: "Track Deliveries",
              description: "Real-time tracking for all your deliveries",
              icon: <Truck className="h-12 w-12 text-blue-400" />,
              action: () => navigate('/dashboard'),
              index: 1
            },
            {
              title: "Profile Management",
              description: "Update and manage your delivery agent profile",
              icon: <UserCheck className="h-12 w-12 text-blue-400" />,
              action: () => navigate('/profile'),
              index: 2
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              custom={item.index}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-blue-400/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader>
                  <motion.div
                    animate={{
                      y: [-10, 10]
                    }}
                    transition={{
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut'
                    }}
                    className="flex justify-center"
                  >
                    {item.icon}
                  </motion.div>
                  <CardTitle className="text-xl text-white text-center mt-4">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-blue-100 text-center">{item.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-0 flex justify-center">
                  <Button 
                    variant="outline" 
                    className="border-blue-300 text-blue-100 hover:bg-blue-800/50"
                    onClick={item.action}
                  >
                    Get Started <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-16"
        >
          <Button 
            size="lg" 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => navigate('/orders')}
          >
            View Orders
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
