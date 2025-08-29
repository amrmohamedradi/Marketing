import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {
  User, Building, Mail, Phone, CheckCircle, DollarSign,
  FileText, Download, Share, X, LucideIcon
} from "lucide-react"; // Explicitly import all used Lucide icons and LucideIcon type
// import * as LucideIcons from "lucide-react"; // Remove this line
import { useAppContext } from "@/lib/AppContext";
import { motion } from "framer-motion";

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
  const { clientDetails, services, priceData, clearFormData } = useAppContext();

  React.useEffect(() => {
    if (!clientDetails || !clientDetails.name || services.length === 0 || !priceData || priceData.basePrice === 0) {
      navigate('/');
    }
  }, [clientDetails, services, priceData, navigate]);

  if (!clientDetails || !clientDetails.name || services.length === 0 || !priceData || priceData.basePrice === 0) {
    return <div className="min-h-screen flex items-center justify-center text-foreground">{t('loading_or_redirecting')}</div>;
  }

  console.log("PreviewPage mounted with state:", { clientDetails, services, priceData });

  const selectedCurrency = [
    { value: "USD", symbol: "$" },
    { value: "EUR", symbol: "€" },
    { value: "GBP", symbol: "£" },
    { value: "CAD", symbol: "C$" },
    { value: "AUD", symbol: "A$" },
    // Arabic Currencies
    { value: "AED", symbol: "د.إ" },
    { value: "SAR", symbol: "ر.س" },
    { value: "QAR", symbol: "ر.ق" },
    { value: "KWD", symbol: "د.ك" },
    { value: "EGP", symbol: "ج.م" },
  ].find(c => c.value === priceData.currency) || { value: "USD", symbol: "$" };

  const getTotalPrice = () => {
    return priceData.basePrice + priceData.additionalItems.reduce((sum: number, item: any) => sum + item.amount, 0);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleClose = () => {
    navigate(-1); // Go back to the previous page
    clearFormData(); // Clear form data
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 bg-background text-foreground"
      dir={currentLanguage === 'en' ? 'ltr' : 'rtl'}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-full mx-auto space-y-4 sm:space-y-2 bg-card text-card-foreground rounded-2xl p-4 sm:p-2 shadow-xl border border-border/50"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pb-4 sm:pb-2 border-b border-border/30">
          <div className="text-lg sm:text-xl font-bold flex items-center gap-1 sm:space-x-2 text-primary">
            <FileText className="w-6 h-6" />
            <span>{t('service_specification')}</span>
          </div>
          <div className="flex items-center gap-1 sm:space-x-2">
            <Button variant="outline" size="xs" className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 p-2">
              <Share className="w-4 h-4 mr-1 sm:mr-2 " />
              {t('share')}
            </Button>
            <Button variant="outline" size="xs" className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 p-2">
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              {t('export')}
            </Button>
            <Button variant="ghost" size="xs" onClick={handleClose} className="hover:bg-muted/50 transition-colors duration-200">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-4">
          {/* Header Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center space-y-4 bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-xl sm:p-4 border border-primary/20"
          >
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent sm:text-2xl">
              {t('service_proposal')}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {t('prepared_for')} <span className="font-medium text-foreground">{clientDetails.name || t('your_client')}</span>
            </p>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs sm:text-xs px-2 py-0.5">
              {t('generated_on')} {new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
            </Badge>
          </motion.div>

          {/* Client Information */}
          {(clientDetails.name || clientDetails.company || clientDetails.email || clientDetails.phone) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-2 sm:space-y-4 bg-card text-card-foreground p-4 sm:p-6 rounded-2xl shadow-md border border-border"
            >
              <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-1 sm:space-x-2 text-primary">
                <User className="w-5 h-5 sm:w-4 sm:h-4" />
                <span>{t('client_information')}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-muted/20 rounded-lg border border-border/30 sm:p-4 sm:gap-4">
                {clientDetails.name && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('name')}</p>
                      <p className="font-medium text-sm">{clientDetails.name}</p>
                    </div>
                  </div>
                )}
                {clientDetails.company && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('company')}</p>
                      <p className="font-medium text-sm">{clientDetails.company}</p>
                    </div>
                  </div>
                )}
                {clientDetails.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('email')}</p>
                      <p className="font-medium text-sm">{clientDetails.email}</p>
                    </div>
                  </div>
                )}
                {clientDetails.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">{t('phone')}</p>
                      <p className="font-medium text-sm">{clientDetails.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              {clientDetails.description && (
                <div className="p-3 bg-muted/30 rounded-lg border border-border/50 sm:p-4">
                  <h4 className="font-medium mb-1 text-sm sm:text-sm text-foreground">{t('project_description')}</h4>
                  <p className="text-muted-foreground text-sm sm:text-sm">{clientDetails.description}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Services Section */}
          {services.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-2 sm:space-y-4 bg-card text-card-foreground p-4 sm:p-6 rounded-2xl shadow-md border border-border"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-primary">{t('services_included')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => {
                  const Icon = service.icon; // Directly use service.icon now that it's typed as LucideIcon
                  return (
                    <div key={service.id} className="p-3 bg-muted/20 rounded-lg border border-border/30 sm:p-4">
                      <div className="space-y-3 sm:space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-1 sm:space-x-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <div>
                              <h3 className="font-semibold text-base sm:text-lg text-foreground">{service.name}</h3>
                              {service.description && (
                                <p className="text-muted-foreground text-sm mt-0.5 sm:mt-1">{service.description}</p>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-xs px-2 py-0.5">
                            {t('service')} {index + 1}
                          </Badge>
                        </div>

                        {service.subServices.length > 0 && (
                          <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-4">
                            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide sm:text-sm">
                              {t('included_items')}
                            </h4>
                            <div className="grid grid-cols-1 gap-1 sm:gap-2">
                              {service.subServices.map((subService: any) => (
                                <div key={subService.id} className="flex items-start gap-2 p-1 bg-muted/20 rounded-md sm:p-2 border border-border/20">
                                  <CheckCircle className="w-3 h-3 text-success mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
                                  <div>
                                    <p className="font-medium text-xs sm:text-sm text-foreground">{subService.name}</p>
                                    {subService.description && (
                                      <p className="text-xxs sm:text-xs text-muted-foreground">{subService.description}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Pricing Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-2 sm:space-y-4 bg-card text-card-foreground p-4 sm:p-6 rounded-2xl shadow-md border border-border"
          >
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-1 sm:space-x-2 text-primary">
              <DollarSign className="w-5 h-5 sm:w-4 sm:h-4" />
              <span>{t('investment')}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="md:col-span-2 p-4 bg-muted/20 rounded-lg border border-border/30 sm:p-6">
                <div className="space-y-4 sm:space-y-2">
                  {/* Base Price */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground">{t('base_price')}</span>
                    <span className="font-semibold text-base sm:text-lg text-primary">
                      {selectedCurrency.symbol}{formatPrice(priceData.basePrice)}
                    </span>
                  </div>

                  {/* Additional Items */}
                  {priceData.additionalItems.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-1 sm:space-y-2 pt-1 sm:pt-2">
                        <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide sm:text-sm">
                          {t('additional_items')}
                        </h4>
                        {priceData.additionalItems.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">{item.description}</span>
                            <span className="font-medium text-sm text-foreground">
                              {selectedCurrency.symbol}{formatPrice(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Total */}
                  <Separator />
                  <div className="flex items-center justify-between text-base sm:text-lg pt-2">
                    <span className="font-bold text-base text-foreground">{t('total_investment')}</span>
                    <span className="font-bold text-primary text-lg sm:text-xl">
                      {selectedCurrency.symbol}{formatPrice(getTotalPrice())}
                    </span>
                  </div>

                  {/* Currency Note */}
                  <p className="text-xs text-muted-foreground text-center mt-2 sm:mt-4">
                    {t('all_prices_in')} {priceData.currency}
                  </p>

                  {/* Price Notes */}
                  {priceData.notes && (
                    <div className="mt-2 p-2 bg-muted/30 rounded-md border border-border/50 sm:p-3 sm:mt-4">
                      <h4 className="font-medium text-xs mb-1 text-foreground sm:text-sm">{t('terms_conditions')}</h4>
                      <p className="text-xs text-muted-foreground sm:text-sm">{priceData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center py-4 border-t border-border/30 mt-4 sm:py-6"
          >
            <p className="text-xs text-muted-foreground sm:text-sm">
              {t('proposal_valid')}
            </p>
            <p className="text-xxs text-muted-foreground mt-1 sm:mt-2">
              {t('generated_with')}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PreviewPage;
