import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import LoginForm from "@/components/LoginForm";
import ClientDetailsSection from "@/components/ClientDetailsSection";
import ServicesSection from "@/components/ServicesSection";
import PriceSection from "@/components/PriceSection";
import PreviewModal from "@/components/PreviewModal";
import Starfield from "@/components/Starfield";
import type { LucideIcon } from "lucide-react";

interface SubService {
  id: string;
  name: string;
  description: string;
  isCustom?: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  subServices: SubService[];
  suggestedItems: { name: string; description: string }[];
}

interface PriceItem {
  id: string;
  description: string;
  amount: number;
}

interface PriceData {
  basePrice: number;
  currency: string;
  additionalItems: PriceItem[];
  notes: string;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
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

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Reset all data
    setClientDetails({
      name: "",
      company: "",
      email: "",
      phone: "",
      description: "",
    });
    setServices([]);
    setPriceData({
      basePrice: 0,
      currency: "USD",
      additionalItems: [],
      notes: "",
    });
  };

  const canPreview = () => {
    return (
      clientDetails.name.trim() !== "" &&
      services.length > 0 &&
      priceData.basePrice > 0
    );
  };

  const { t } = useI18n();

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background Starfield */}
      <div className="absolute inset-0 -z-10">
        <Starfield starCount={300} parallaxStrength={0.12} />
      </div>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/logo.webp" alt="ركن التسويق Logo" className="h-8 w-8 rounded-full" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-white p-2">ركن التسويق</span>
          </div>
          <div className="flex items-center space-x-4">
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
              onClick={() => setIsPreviewOpen(true)}
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
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        clientDetails={clientDetails}
        services={services}
        priceData={priceData}
      />
    </div>
  );
};

export default Index;
