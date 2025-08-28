import { Button } from "@/components/ui/button";
import { Sparkles, Eye, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import LoginForm from "@/components/LoginForm";
import ClientDetailsSection from "@/components/ClientDetailsSection";
import ServicesSection from "@/components/ServicesSection";
import PriceSection from "@/components/PriceSection";
import Starfield from "@/components/Starfield";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext"; // Import useAppContext
import { motion } from "framer-motion"; // Added motion import

const Index = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // Removed, using context
  // const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Removed
  
  const { clientDetails, setClientDetails, services, setServices, priceData, setPriceData, clearAllData, isLoggedIn, setIsLoggedIn } = useAppContext(); // Use useAppContext

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
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-background" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background Starfield */}
      <div className="absolute inset-0 -z-10">
        <Starfield starCount={300} parallaxStrength={0.12} />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12 md:space-y-16">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
            {t('heading_main')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('heading_desc')}
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => changeLanguage(currentLanguage === 'ar' ? 'en' : 'ar')}
            className="mt-4 text-lg px-6 py-3 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
          >
            {currentLanguage === 'ar' ? 'English' : 'العربية'}
          </Button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-card text-card-foreground p-6 sm:p-8 rounded-2xl shadow-lg border border-border"
          >
            <ClientDetailsSection
              clientDetails={clientDetails}
              onUpdate={setClientDetails}
            />
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-card text-card-foreground p-6 sm:p-8 rounded-2xl shadow-lg border border-border"
          >
            <ServicesSection
              services={services}
              onUpdate={setServices}
            />
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="lg:col-span-2 bg-card text-card-foreground p-6 sm:p-8 rounded-2xl shadow-lg border border-border"
          >
            <PriceSection
              priceData={priceData}
              onUpdate={setPriceData}
            />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex justify-center space-x-4 pt-8"
        >
          <Button
            onClick={() => navigate('/preview')}
            disabled={!canPreview()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg rounded-full shadow-md transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            <Eye className="w-5 h-5 mr-2" />
            {t('preview_spec')}
          </Button>
        </motion.div>

        {!canPreview() && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-center text-muted-foreground mt-4 text-sm italic"
          >
            <p>{t('complete_steps_hint')}</p>
          </motion.div>
        )}
      </main>
    </motion.div>
  );
};

export default Index;
