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
      <nav className="container mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between p-3 sm:p-4 gap-2 sm:gap-0">
        <div className='flex items-center space-x-2'>
          <Link to="/" className="text-lg sm:text-xl lg:text-2xl font-bold text-primary p-1 sm:p-2 text-center">
            {t('marketing_corner_logo_text')}
          </Link>
        </div>

        {/* Responsive Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 px-2 sm:px-3 py-1 sm:py-2"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">{t('logout')}</span>
            <span className="xs:hidden">Exit</span>
          </Button>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
