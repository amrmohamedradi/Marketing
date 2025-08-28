import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import LoginForm from "@/components/LoginForm";
import ClientDetailsSection from "@/components/ClientDetailsSection";
import ServicesSection from "@/components/ServicesSection";
import PriceSection from "@/components/PriceSection";
// import PreviewModal from "@/components/PreviewModal"; // Removed
import Starfield from "@/components/Starfield";
import type { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/lib/AppContext"; // Import useAppContext

// Remove these interfaces, as they are now defined in AppContext.tsx
// interface SubService { /* ... */ }
// interface Service { /* ... */ }
// interface PriceItem { /* ... */ }
// interface PriceData { /* ... */ }

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Removed
  
  const { clientDetails, setClientDetails, services, setServices, priceData, setPriceData, clearAllData } = useAppContext(); // Use useAppContext

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

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen bg-background" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Starfield */}
      <div className="absolute inset-0 -z-10">
        <Starfield starCount={300} parallaxStrength={0.12} />
      </div>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.webp" alt="Marketing Corner Logo" className="h-8 w-8 rounded-full" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-white p-2">{t('marketing_corner_logo_text')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="btn-ghost-primary sm:order-last"
              onClick={() => changeLanguage(currentLanguage === 'ar' ? 'en' : 'ar')}
            >
              {currentLanguage === 'ar' ? 'English' : 'العربية'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8 fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('heading_main')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('heading_desc')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <ClientDetailsSection
            clientDetails={clientDetails}
            onUpdate={setClientDetails}
          />
          
          <ServicesSection
            services={services}
            onUpdate={setServices}
          />
          
          <PriceSection
            priceData={priceData}
            onUpdate={setPriceData}
          />

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 pt-8">
            <Button
              onClick={() => navigate('/preview')}
              disabled={!canPreview()}
              className="btn-gradient px-8 py-3 text-lg"
            >
              <Eye className="w-5 h-5 mr-2" />
              {t('preview_spec')}
            </Button>
          </div>

          {!canPreview() && (
            <div className="text-center text-muted-foreground">
              <p className="text-sm">{t('complete_steps_hint')}</p>
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      {/* <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        clientDetails={clientDetails}
        services={services}
        priceData={priceData}
      /> */}
    </div>
  );
};

export default Index;
