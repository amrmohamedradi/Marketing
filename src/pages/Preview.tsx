import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import {
  Save, Sparkles, Star, ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/lib/AppContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { canonLang } from "@/lib/lang";
import { isSupportEditorEnabled } from "@/lib/featureFlags";
import AboutClientPreview from "@/components/dashboard/preview/AboutClientPreview";
import ServicesPreview from "@/components/dashboard/preview/ServicesPreview";
import SupportPreview from "@/components/dashboard/preview/SupportPreview";
import PricingPreview from "@/components/dashboard/preview/PricingPreview";

// Remove the getLucideIcon helper function
/*
const getLucideIcon = (iconName: string) => {
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
  if (IconComponent) {
    return IconComponent;
  }
  return LucideIcons.FileText; 
};
*/

// Remove these interfaces, as they are now defined in AppContext.tsx
/*
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
  icon: LucideIcon; // Change back to LucideIcon type
  subServices: SubService[];
  suggestedItems: { name: string; description: string }[];
}

interface ClientDetails {
  name: string;
  company: string;
  email: string;
  phone: string;
  description: string;
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
*/

const PreviewPage = () => {
  const { t, currentLanguage } = useI18n();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clientDetails, services, priceData, supportItems, clearFormData } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  
  const lang = canonLang(currentLanguage);

  React.useEffect(() => {
    if (!clientDetails || !clientDetails.name || services.length === 0 || !priceData || priceData.basePrice === 0) {
      navigate('/');
    }
  }, [clientDetails, services, priceData, navigate]);

  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!clientDetails || !clientDetails.name || services.length === 0 || !priceData || priceData.basePrice === 0) {
    return <div className="min-h-screen flex items-center justify-center text-foreground">{t('loading_or_redirecting')}</div>;
  }

  console.log("PreviewPage mounted with state:", { clientDetails, services, priceData });


  const handleClose = () => {
    navigate(-1); // Go back to the previous page
    clearFormData(); // Clear form data
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Generate a slug from client name with fallback
      let slug = clientDetails.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // If slug is empty or too short, use a fallback
      if (!slug || slug.length < 2) {
        slug = `client-${Date.now()}`;
      }
      
      // Map the frontend data to the new spec format
      const specData: Record<string, unknown> = {
        clientDetails: clientDetails,
        services: services,
        pricing: priceData,
        summary: clientDetails.description,
        deliverables: services.flatMap(s => s.subServices.map(sub => sub.name)),
        team: [],
        techStack: [],
        timeline: '',
        notes: priceData.notes,
        contact: {
          phone: clientDetails.phone,
          email: clientDetails.email
        }
      };

      // Only include support data if the feature flag is enabled
      if (isSupportEditorEnabled()) {
        specData.support = supportItems;
      }
      
      // Import and use the new API
      const { saveSpec } = await import('@/lib/api');
      const response = await saveSpec(slug, specData);
      
      if (response && response.ok) {
        // Navigate to your UI page, NOT the backend JSON:
        navigate(`/read/${response.id || slug}`);
        
        toast({
          title: t('save_success'),
          description: t('spec_saved_successfully'),
          variant: 'default',
        });
        
        console.log('Spec saved successfully:', response);
      } else {
        console.error('Save failed:', response);
        toast({
          title: t('save_error'),
          description: response?.error || t('error_saving_spec'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Exception in handleSave:', error);
      toast({
        title: t('save_error'),
        description: error instanceof Error ? error.message : t('error_saving_spec'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 text-foreground relative overflow-hidden"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      key={lang}
    >
      {/* Starfield Background */}
      <div className="fixed inset-0 z-0">
        <Starfield 
          className="absolute inset-0"
          starCount={350}
          maxStarSize={3}
          parallaxStrength={0.12}
          speed={0.06}
          moonSizeFactor={1.5}
          moonColor="rgba(220, 220, 240, 0.9)"
          mouseParallaxStarsFraction={0.6}
          showShootingStars={true}
          showNebula={true}
          showPlanets={true}
        />
      </div>

      {/* Main Content Container with Glassmorphism */}
      <div className="relative z-10 backdrop-blur-xl bg-background/80 border border-border/50 rounded-3xl mx-4 my-8 shadow-2xl">
        <div className="center-wrap py-12 space-y-12">

        {/* Hero Section */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ y, opacity }}
        >

          <h1 className="h1-fluid font-bold text-white mb-6">
            {t('service_specification')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('comprehensive_overview')}
          </p>

          <div className="flex justify-center mt-10">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="px-8 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary via-accent to-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 disabled:opacity-50"
              >
                <Save className="w-5 h-5 mr-3" />
                {isSaving ? t('saving') : t('save_specification')}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Preview Components with Enhanced Spacing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="space-y-8"
        >
          <AboutClientPreview data={{ clientDetails: clientDetails }} lang={lang} />
          <ServicesPreview data={{ services }} lang={lang} />
          <SupportPreview data={{ support: { items: supportItems } }} lang={lang} />
          <PricingPreview data={{ pricing: priceData }} lang={lang} />
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-center py-8 border-t border-gradient-to-r from-transparent via-border/50 to-transparent mt-12"
        >
          <div className="space-y-4">
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('proposal_valid')}
            </p>
          </div>
        </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewPage;
