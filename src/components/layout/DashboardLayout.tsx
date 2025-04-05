
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { User, Home, LogOut, Settings, Menu, X, ChevronLeft, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Footer from './Footer';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, label, icon, active, onClick }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const navigation = [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/orders", label: "Orders", icon: <Package size={18} /> },
    { href: "/profile", label: "Profile", icon: <User size={18} /> },
    { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success("Logged out successfully");
      // Vibrate when logging out for haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out");
    }
  };

  const handleBack = () => {
    // Vibrate when going back for haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    navigate(-1);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
    // Vibrate when closing menu for haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header for Mobile */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button 
                  className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground" 
                  aria-label="Open menu"
                  onClick={() => {
                    if (navigator.vibrate) {
                      navigator.vibrate(50);
                    }
                  }}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[250px]">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">DoorRush Pilot</h2>
                    <button 
                      onClick={closeMobileMenu}
                      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                      aria-label="Close menu"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => (
                      <NavItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        icon={item.icon}
                        active={location.pathname === item.href}
                        onClick={closeMobileMenu}
                      />
                    ))}
                  </nav>
                  <div className="p-4 border-t">
                    <button 
                      onClick={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
                      aria-label="Log out"
                    >
                      <LogOut size={18} />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex items-center gap-2">
            {location.pathname !== "/dashboard" && (
              <button 
                onClick={handleBack}
                className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-xl font-semibold">
              {location.pathname === "/dashboard" && "Dashboard"}
              {location.pathname === "/orders" && "Orders"}
              {location.pathname === "/profile" && "Profile"}
              {location.pathname === "/settings" && "Settings"}
            </h1>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar for Desktop */}
        <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
          <div className="p-6">
            <h1 className="text-xl font-semibold">DoorRush Pilot</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2" aria-label="Main navigation">
            {navigation.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={location.pathname === item.href}
              />
            ))}
          </nav>
          
          <div className="p-4 border-t border-border">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
              aria-label="Log out"
            >
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="container py-4 md:py-8"
            >
              {children}
            </motion.div>
          </main>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
