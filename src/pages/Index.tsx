import { Button } from "@/components/ui/button";
import { Sparkles, Eye, LogOut, Zap, Star, ArrowRight, CheckCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import AuthForm from "@/components/AuthForm";
import ClientDetailsSection from "@/components/ClientDetailsSection";
import ServicesSection from "@/components/ServicesSection";
import PriceSection from "@/components/PriceSection";
import Starfield from "@/components/Starfield";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext"; // Import useAppContext
import { motion, useScroll, useTransform } from "framer-motion"; // Enhanced motion import

import { useIsMobile, useIsExtraSmall } from "@/hooks/use-mobile";

const Index = () => {
  const { clientDetails, setClientDetails, services, setServices, priceData, setPriceData, clearAllData, isLoggedIn, setIsLoggedIn } = useAppContext();
  const isMobile = useIsMobile();
  const isExtraSmall = useIsExtraSmall();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const handleLogout = () => {
    clearAllData(); // Use clearAllData from context
  };

  const canPreview = () => {
    return (
      clientDetails.name.trim() !== "" &&
      services.length > 0 &&
      priceData.basePrice > 0
    );
  };

  const { t, changeLanguage, currentLanguage } = useI18n();
  const navigate = useNavigate();


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background relative overflow-hidden"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      key={currentLanguage}
    >
      {/* Enhanced Space Background */}
      <div className="fixed inset-0 z-0">
        <Starfield 
          className="absolute inset-0"
          starCount={300}
          maxStarSize={2.5}
          parallaxStrength={0.08}
          speed={0.04}
          moonSizeFactor={1}
          moonColor="rgba(200, 200, 220, 0.6)"
          mouseParallaxStarsFraction={0.8}
          showShootingStars={true}
          showNebula={true}
          showPlanets={true}
        />
      </div>

      <div className={`center-wrap ${isExtraSmall ? 'py-2 space-y-4' : isMobile ? 'py-3 space-y-5' : 'py-3 sm:py-6 lg:py-8 space-y-6 sm:space-y-8 lg:space-y-12'}`}>
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className="text-center space-y-3 sm:space-y-4 relative z-10"
        >
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className={`${isExtraSmall ? 'text-xl' : isMobile ? 'text-2xl' : 'h1-fluid'} font-black text-foreground leading-tight tracking-tight ${isExtraSmall ? 'px-1' : 'px-2 sm:px-4'}`}
          >
            {t('heading_main')}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className={`${isExtraSmall ? 'text-sm' : isMobile ? 'text-base' : 'text-base sm:text-lg lg:text-xl'} text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isExtraSmall ? 'px-2' : 'px-3 sm:px-6'}`}
          >
            {t('heading_desc')}
          </motion.p>
          
          {/* Required Fields Legend */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className={`flex items-center justify-center space-x-2 ${isExtraSmall ? 'text-xs' : 'text-xs sm:text-sm'} text-muted-foreground bg-muted/30 ${isExtraSmall ? 'px-2 py-1.5' : 'px-3 sm:px-4 py-2'} rounded-lg border border-border/50 ${isExtraSmall ? 'max-w-xs' : 'max-w-xs sm:max-w-md'} mx-auto`}
          >
            <span className="text-red-500">*</span>
            <span>{t('required_fields_note')}</span>
          </motion.div>
          
          {/* Language Toggle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size={isExtraSmall ? "sm" : isMobile ? "default" : "lg"}
              onClick={() => changeLanguage(currentLanguage === 'ar' ? 'en' : 'ar')}
              className={`${isExtraSmall ? 'mt-3 text-sm px-3 py-2' : isMobile ? 'mt-4 text-base px-4 py-2.5' : 'mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4'} rounded-xl xs:rounded-2xl card-neo border-primary/30 text-foreground hover:border-primary/50 transition-all duration-300 font-semibold`}
            >
              {currentLanguage === 'ar' ? 'English' : 'العربية'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Form Cards */}
        <div className={`center-grid grid-cols-1 max-w-5xl mx-auto ${isExtraSmall ? 'px-2' : 'px-3 sm:px-4'} relative z-10`}>
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <div className={`card-neo ${isExtraSmall ? 'p-2 rounded-xl' : isMobile ? 'p-3 rounded-xl' : 'p-4 sm:p-6 lg:p-8 xl:p-10 rounded-2xl'} shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20`}>
              <ClientDetailsSection
                clientDetails={clientDetails}
                onUpdate={setClientDetails}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <div className="card-neo p-4 sm:p-6 lg:p-8 xl:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20">
              <ServicesSection
                services={services}
                onUpdate={setServices}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <div className={`card-neo ${isExtraSmall ? 'p-2 rounded-xl' : isMobile ? 'p-3 rounded-xl' : 'p-4 sm:p-6 lg:p-8 xl:p-10 rounded-2xl'} shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20`}>
              <PriceSection
                priceData={priceData}
                onUpdate={setPriceData}
              />
            </div>
          </motion.div>
        </div>

        {/* Action Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="text-center space-y-4 sm:space-y-6 px-3 sm:px-4 relative z-10"
        >
          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/preview')}
              disabled={!canPreview()}
              className={`w-full sm:w-auto ${isExtraSmall ? 'px-4 py-2.5 text-sm rounded-lg' : isMobile ? 'px-6 py-3 text-base rounded-xl' : 'px-6 sm:px-12 lg:px-16 py-3 sm:py-4 lg:py-6 text-base sm:text-lg lg:text-xl rounded-2xl'} font-bold bg-gradient-to-r from-primary via-accent to-primary text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <span className={`flex items-center ${isExtraSmall ? 'gap-1.5' : 'gap-2 sm:gap-3'}`}>
                <Eye className={`${isExtraSmall ? 'w-3 h-3' : 'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6'}`} />
                {t('preview_spec')}
                <ArrowRight className={`${isExtraSmall ? 'w-3 h-3' : 'w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5'} group-hover:translate-x-1 transition-transform duration-150`} />
              </span>
            </Button>
          </motion.div>

          {!canPreview() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              className="flex items-center justify-center gap-2 text-muted-foreground text-xs sm:text-sm max-w-sm mx-auto"
            >
              <div className="w-2 h-2 sm:w-3 sm:h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-center">{t('complete_steps_hint')}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
