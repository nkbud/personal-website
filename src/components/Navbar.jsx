import React, { useState } from 'react';
import { Menu, UserCircle, X, Brain, LogOut, UserCog, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { sectionsConfig } from '@/config/site';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ onNavigate, siteTitle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { session, user, signOut, isAdmin, setAuthModalOpen } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNav = (sectionId) => {
    onNavigate(sectionId);
    setIsMenuOpen(false);
  };
  
  const navLinks = [
    { name: 'Home', id: 'home' },
    ...sectionsConfig.map(s => ({ name: s.heading, id: s.slug })),
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];
  
  if (isAdmin) {
    // Example: Add an admin specific link if needed, or handle admin navigation elsewhere
    // navLinks.push({ name: 'Admin Dashboard', id: 'admin' });
  }

  const handleAccountClick = () => {
    if (!session) {
      setAuthModalOpen(true);
    }
    // If session exists, DropdownMenu handles itself
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="hidden md:flex items-center space-x-2">
           <Button variant="ghost" onClick={toggleMenu}>
            <Menu className="h-5 w-5 mr-2" />
            Menu
          </Button>
        </div>

        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
          onClick={() => handleNav('home')}
        >
          {siteTitle}
        </div>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.name || user?.email} />
                  <AvatarFallback>{user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || user?.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {isAdmin ? 'Administrator' : 'User'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem onClick={() => onNavigate('admin')}> {/* Placeholder for actual admin navigation */}
                  <UserCog className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => { /* Future settings page */ }}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleAccountClick}>
            <UserCircle className="h-6 w-6" />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 h-screen bg-background p-6 md:w-72 shadow-lg flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-2 text-primary cursor-pointer" onClick={() => handleNav('home')}>
                <Brain className="h-7 w-7" />
                <span className="text-xl font-bold">{siteTitle}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-3 flex-grow">
              {navLinks.map((link) => (
                <Button
                  key={link.id}
                  variant="ghost"
                  className="justify-start text-lg py-3"
                  onClick={() => handleNav(link.id)}
                >
                  {link.name}
                </Button>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-border">
              {session ? (
                 <Button variant="outline" className="w-full" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
              ) : (
                <Button variant="default" className="w-full" onClick={handleAccountClick}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    Sign In / Sign Up
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;