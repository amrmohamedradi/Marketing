import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  CheckCircle, 
  DollarSign,
  FileText,
  Download,
  Share,
  X
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";

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
  icon: React.ComponentType<{ className?: string }>;
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

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientDetails: ClientDetails;
  services: Service[];
  priceData: PriceData;
}

const PreviewModal = ({ isOpen, onClose, clientDetails, services, priceData }: PreviewModalProps) => {
  const { t } = useI18n();

  const selectedCurrency = [
    { value: "USD", symbol: "$" },
    { value: "EUR", symbol: "€" },
    { value: "GBP", symbol: "£" },
    { value: "CAD", symbol: "C$" },
    { value: "AUD", symbol: "A$" },
  ].find(c => c.value === priceData.currency) || { value: "USD", symbol: "$" };

  const getTotalPrice = () => {
    return priceData.basePrice + priceData.additionalItems.reduce((sum: number, item: any) => sum + item.amount, 0);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
            <FileText className="w-6 h-6 text-primary" />
            <span>{t('service_specification')}</span>
          </DialogTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="btn-ghost-primary">
              <Share className="w-4 h-4 mr-2" />
              {t('share')}
            </Button>
            <Button variant="outline" size="sm" className="btn-ghost-primary">
              <Download className="w-4 h-4 mr-2" />
              {t('export')}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4 bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('service_proposal')}
            </h1>
            <p className="text-muted-foreground">
              {t('prepared_for')} {clientDetails.name || t('your_client')}
            </p>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              {t('generated_on')} {new Date().toLocaleDateString('ar-EG')}
            </Badge>
          </div>

          {/* Client Information */}
          {(clientDetails.name || clientDetails.company || clientDetails.email || clientDetails.phone) && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <span>{t('client_information')}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface-elevated rounded-lg border border-border/30">
                {clientDetails.name && (
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('name')}</p>
                      <p className="font-medium">{clientDetails.name}</p>
                    </div>
                  </div>
                )}
                {clientDetails.company && (
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('company')}</p>
                      <p className="font-medium">{clientDetails.company}</p>
                    </div>
                  </div>
                )}
                {clientDetails.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('email')}</p>
                      <p className="font-medium">{clientDetails.email}</p>
                    </div>
                  </div>
                )}
                {clientDetails.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t('phone')}</p>
                      <p className="font-medium">{clientDetails.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              {clientDetails.description && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <h4 className="font-medium mb-2">{t('project_description')}</h4>
                  <p className="text-muted-foreground">{clientDetails.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Services Section */}
          {services.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('services_included')}</h2>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={service.id} className="p-4 bg-surface-elevated rounded-lg border border-border/30">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          {service.description && (
                            <p className="text-muted-foreground mt-1">{service.description}</p>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {t('service')} {index + 1}
                        </Badge>
                      </div>
                      
                      {service.subServices.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                            {t('included_items')}
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {service.subServices.map((subService: any) => (
                              <div key={subService.id} className="flex items-start space-x-3 p-2 bg-muted/20 rounded">
                                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">{subService.name}</p>
                                  {subService.description && (
                                    <p className="text-xs text-muted-foreground">{subService.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>{t('investment')}</span>
            </h2>
            <div className="p-6 bg-surface-elevated rounded-lg border border-border/30">
              <div className="space-y-4">
                {/* Base Price */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t('base_price')}</span>
                  <span className="font-semibold text-lg">
                    {selectedCurrency.symbol}{formatPrice(priceData.basePrice)}
                  </span>
                </div>

                {/* Additional Items */}
                {priceData.additionalItems.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        {t('additional_items')}
                      </h4>
                      {priceData.additionalItems.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{item.description}</span>
                          <span className="font-medium">
                            {selectedCurrency.symbol}{formatPrice(item.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Total */}
                <Separator />
                <div className="flex items-center justify-between text-lg">
                  <span className="font-bold">{t('total_investment')}</span>
                  <span className="font-bold text-primary text-xl">
                    {selectedCurrency.symbol}{formatPrice(getTotalPrice())}
                  </span>
                </div>

                {/* Currency Note */}
                <p className="text-sm text-muted-foreground text-center">
                  {t('all_prices_in')} {priceData.currency}
                </p>

                {/* Price Notes */}
                {priceData.notes && (
                  <div className="mt-4 p-3 bg-muted/30 rounded border border-border/50">
                    <h4 className="font-medium text-sm mb-2">{t('terms_conditions')}</h4>
                    <p className="text-sm text-muted-foreground">{priceData.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {t('proposal_valid')}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t('generated_with')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;