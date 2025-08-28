import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useI18n } from '@/lib/i18n';
import { LogOut } from 'lucide-react';
import { useAppContext } from '@/lib/AppContext';

const Header = () => {
  const { t } = useI18n();
  const { clearAllData } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAllData();
    navigate('/'); // Redirect to home/login page after logout
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md shadow-lg"
    >
      <nav className="container mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between p-4 gap-2">
        <Link to="/" className="text-2xl font-bold text-primary">
          {t('marketing_corner_logo_text')}
        </Link>

        {/* Desktop Navigation - only Logout button */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('logout')}
          </Button>
        </div>

        {/* Mobile Navigation - only Logout button */}
        {/* Removed Mobile Navigation Sheet */}
      </nav>
    </motion.header>
  );
};

export default Header;
