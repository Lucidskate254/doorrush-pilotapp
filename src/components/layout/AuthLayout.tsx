
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight mb-2">{title}</h1>
              {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
            </div>
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthLayout;
