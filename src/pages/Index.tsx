import { Button } from "@/components/ui/button";
import { Sparkles, Eye, LogOut, Zap, Star, ArrowRight, CheckCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import LoginForm from "@/components/LoginForm";
import ClientDetailsSection from "@/components/ClientDetailsSection";
import ServicesSection from "@/components/ServicesSection";
import PriceSection from "@/components/PriceSection";
import Starfield from "@/components/Starfield";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext"; // Import useAppContext
import { motion, useScroll, useTransform } from "framer-motion"; // Enhanced motion import

const Index = () => {
  const { clientDetails, setClientDetails, services, setServices, priceData, setPriceData, clearAllData, isLoggedIn, setIsLoggedIn } = useAppContext();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Remove local state for clientDetails, services, priceData
  /*
  const [clientDetails, setClientDetails] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    description: "",
  });

  const [services, setServices] = useState<Service[]>([]);

  const [priceData, setPriceData] = useState<PriceData>({
    basePrice: 0,
    currency: "USD",
    additionalItems: [],
    notes: "",
  });
  */

  // const handleLogin = () => {
  //   setIsLoggedIn(true);
  // }; // Removed, now handled by LoginForm through context

  const handleLogout = () => {
    // setIsLoggedIn(false); // Removed, now handled by clearAllData
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
  // const { setPreviewData } = usePreviewData(); // Removed

  if (!isLoggedIn) {
    return <LoginForm /* onLogin={handleLogin} */ />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      key={currentLanguage}
    >
      <div className="center-wrap py-4 sm:py-8 space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className="text-center space-y-4"
        >
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="h1-fluid font-black text-foreground leading-tight tracking-tight"
          >
            {t('heading_main')}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t('heading_desc')}
          </motion.p>
          
          {/* Required Fields Legend */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex items-center justify-center space-x-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-lg border border-border/50 max-w-md mx-auto"
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
              size="lg"
              onClick={() => changeLanguage(currentLanguage === 'ar' ? 'en' : 'ar')}
              className="mt-6 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl card-neo border-primary/30 text-foreground hover:border-primary/50 transition-all duration-300 font-semibold"
            >
              {currentLanguage === 'ar' ? 'English' : 'العربية'}
            </Button>
          </motion.div>
        </motion.div>

        {/* Form Cards */}
        <div className="center-grid grid-cols-1 max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <div className="card-neo p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20">
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
            <div className="card-neo p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/20">
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
            <div className="card-neo p-6 sm:p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20">
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
          className="text-center space-y-6 px-4"
        >
          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/preview')}
              disabled={!canPreview()}
              className="w-full sm:w-auto px-8 sm:px-16 py-4 sm:py-6 text-lg sm:text-xl font-bold rounded-2xl bg-gradient-to-r from-primary via-accent to-primary text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="flex items-center gap-3">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                {t('preview_spec')}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-150" />
              </span>
            </Button>
          </motion.div>

          {!canPreview() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              className="flex items-center justify-center gap-2 text-muted-foreground text-xs sm:text-sm"
            >
              <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p>{t('complete_steps_hint')}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Index;
