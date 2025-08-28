import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom"; // Removed useLocation
import React from 'react';
import * as LucideIcons from "lucide-react";
import { useAppContext } from "@/lib/AppContext"; // Import useAppContext

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
  icon: string; // Change from React.ComponentType<{ className?: string }> to string
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

const PreviewPage = () => {
  const { t, currentLanguage } = useI18n();
  const navigate = useNavigate();
  const { clientDetails, services, priceData } = useAppContext(); // Get data from useAppContext

  // Redirect if essential data is missing
  if (!clientDetails || !clientDetails.name || services.length === 0 || !priceData || priceData.basePrice === 0) {
    React.useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null; // Or a loading spinner
  }

  console.log("PreviewPage mounted with state:", { clientDetails, services, priceData });

  const selectedCurrency = [
    { value: "USD", symbol: "$" },
    { value: "EUR", symbol: "€" },
    { value: "GBP", symbol: "£" },
    { value: "CAD", symbol: "C$" },
    { value: "AUD", symbol: "A$" },
  ].find(c => c.value === priceData.currency) || { value: "USD", symbol: "$" };

  const getTotalPrice = () => {
    return priceData.basePrice + priceData.additionalItems.reduce((sum: number, item: PriceItem) => sum + item.amount, 0);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div
      className="min-h-screen p-4 bg-background text-foreground"
      dir={currentLanguage === 'en' ? 'ltr' : 'rtl'}
    >
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-4 bg-surface-elevated rounded-lg p-6 sm:p-4 shadow-lg border border-border/50">
        <div className="flex flex-row items-center justify-between space-y-0 pb-4 sm:pb-2">
          <div className="text-2xl font-bold flex items-center space-x-2 sm:text-xl">
            <LucideIcons.FileText className="w-6 h-6 text-primary" />
            <span>{t('service_specification')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="btn-ghost-primary m-5 sm:m-2">
              <LucideIcons.Share className="w-4 h-4 mr-2 " />
              {t('share')}
            </Button>
            <Button variant="outline" size="sm" className="btn-ghost-primary ">
              <LucideIcons.Download className="w-4 h-4 mr-2" />
              {t('export')}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClose} className="sm:p-2">
              <LucideIcons.X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-8 sm:space-y-4">
          {/* Header Section */}
          <div className="text-center space-y-4 bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg sm:p-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent sm:text-2xl">
              {t('service_proposal')}
            </h1>
            <p className="text-muted-foreground sm:text-sm">
              {t('prepared_for')} {clientDetails.name || t('your_client')}
            </p>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 sm:text-xs">
              {t('generated_on')} {new Date().toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
            </Badge>
          </div>

          {/* Client Information */}
          {(clientDetails.name || clientDetails.company || clientDetails.email || clientDetails.phone) && (
            <div className="space-y-4 sm:space-y-2">
              <h2 className="text-xl font-semibold flex items-center space-x-2 sm:text-lg">
                <LucideIcons.User className="w-5 h-5 text-primary sm:w-4 sm:h-4" />
                <span>{t('client_information')}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface-elevated rounded-lg border border-border/30 sm:p-3 sm:gap-2">
                {clientDetails.name && (
                  <div className="flex items-center space-x-3">
                    <LucideIcons.User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground sm:text-xs">{t('name')}</p>
                      <p className="font-medium sm:text-sm">{clientDetails.name}</p>
                    </div>
                  </div>
                )}
                {clientDetails.company && (
                  <div className="flex items-center space-x-3">
                    <LucideIcons.Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground sm:text-xs">{t('company')}</p>
                      <p className="font-medium sm:text-sm">{clientDetails.company}</p>
                    </div>
                  </div>
                )}
                {clientDetails.email && (
                  <div className="flex items-center space-x-3">
                    <LucideIcons.Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground sm:text-xs">{t('email')}</p>
                      <p className="font-medium sm:text-sm">{clientDetails.email}</p>
                    </div>
                  </div>
                )}
                {clientDetails.phone && (
                  <div className="flex items-center space-x-3">
                    <LucideIcons.Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground sm:text-xs">{t('phone')}</p>
                      <p className="font-medium sm:text-sm">{clientDetails.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              {clientDetails.description && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50 sm:p-3">
                  <h4 className="font-medium mb-2 sm:text-sm">{t('project_description')}</h4>
                  <p className="text-muted-foreground sm:text-sm">{clientDetails.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Services Section */}
          {services.length > 0 && (
            <div className="space-y-4 sm:space-y-2">
              <h2 className="text-xl font-semibold sm:text-lg">{t('services_included')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => {
                  const Icon = LucideIcons[service.icon as keyof typeof LucideIcons] || LucideIcons.FileText;
                  return (
                    <div key={service.id} className="p-4 bg-surface-elevated rounded-lg border border-border/30 sm:p-3">
                      <div className="space-y-3 sm:space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <div>
                              <h3 className="font-semibold text-lg sm:text-base">{service.name}</h3>
                              {service.description && (
                                <p className="text-muted-foreground mt-1 sm:text-sm">{service.description}</p>
                              )}
                            </div>
                          </div>
                          <Badge variant="secondary" className="sm:text-xs">
                            {t('service')} {index + 1}
                          </Badge>
                        </div>

                        {service.subServices.length > 0 && (
                          <div className="space-y-2 sm:space-y-1">
                            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide sm:text-xs">
                              {t('included_items')}
                            </h4>
                            <div className="grid grid-cols-1 gap-2 sm:gap-1">
                              {service.subServices.map((subService: SubService) => (
                                <div key={subService.id} className="flex items-start space-x-3 p-2 bg-muted/20 rounded sm:p-1">
                                  <LucideIcons.CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0 sm:w-3 sm:h-3" />
                                  <div>
                                    <p className="font-medium text-sm sm:text-xs">{subService.name}</p>
                                    {subService.description && (
                                      <p className="text-xs text-muted-foreground sm:text-xxs">{subService.description}</p>
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
            </div>
          )}

          {/* Pricing Section */}
          <div className="space-y-4 sm:space-y-2">
            <h2 className="text-xl font-semibold flex items-center space-x-2 sm:text-lg">
              <LucideIcons.DollarSign className="w-5 h-5 text-primary sm:w-4 sm:h-4" />
              <span>{t('investment')}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-surface-elevated rounded-lg border border-border/30 sm:p-3">
                <div className="space-y-4 sm:space-y-2">
                  {/* Base Price */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium sm:text-sm">{t('base_price')}</span>
                    <span className="font-semibold text-lg sm:text-base">
                      {selectedCurrency.symbol}{formatPrice(priceData.basePrice)}
                    </span>
                  </div>

                  {/* Additional Items */}
                  {priceData.additionalItems.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2 sm:space-y-1">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide sm:text-xs">
                          {t('additional_items')}
                        </h4>
                        {priceData.additionalItems.map((item: PriceItem) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span className="text-muted-foreground sm:text-sm">{item.description}</span>
                            <span className="font-medium sm:text-sm">
                              {selectedCurrency.symbol}{formatPrice(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Total */}
                  <Separator />
                  <div className="flex items-center justify-between text-lg sm:text-base">
                    <span className="font-bold sm:text-base">{t('total_investment')}</span>
                    <span className="font-bold text-primary text-xl sm:text-lg">
                      {selectedCurrency.symbol}{formatPrice(getTotalPrice())}
                    </span>
                  </div>

                  {/* Currency Note */}
                  <p className="text-sm text-muted-foreground text-center sm:text-xs">
                    {t('all_prices_in')} {priceData.currency}
                  </p>

                  {/* Price Notes */}
                  {priceData.notes && (
                    <div className="mt-4 p-3 bg-muted/30 rounded border border-border/50 sm:p-2 sm:mt-2">
                      <h4 className="font-medium text-sm mb-2 sm:text-xs">{t('terms_conditions')}</h4>
                      <p className="text-sm text-muted-foreground sm:text-xs">{priceData.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-6 border-t border-border sm:py-4">
            <p className="text-sm text-muted-foreground sm:text-xs">
              {t('proposal_valid')}
            </p>
            <p className="text-xs text-muted-foreground mt-2 sm:text-xxs sm:mt-1">
              {t('generated_with')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
