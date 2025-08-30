import React from 'react';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useI18n } from '@/lib/i18n';
import { DollarSign } from 'lucide-react';

interface PriceItem {
  id: string;
  description: string;
  amount?: number;
}

interface PricingData {
  basePrice?: number;
  currency?: string;
  additionalItems?: PriceItem[];
  notes?: string;
}

interface PricingProps {
  pricing: PricingData;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  AED: 'د.إ',
  SAR: 'ر.س',
  QAR: 'ر.ق',
  KWD: 'د.ك',
  EGP: 'ج.م'
};

export function Pricing({ pricing }: PricingProps) {
  const { ref, isVisible } = useRevealOnScroll();
  const { t } = useI18n();

  const hasValidPricing = pricing.basePrice || 
    (pricing.additionalItems && pricing.additionalItems.some(item => item.description?.trim()));

  if (!hasValidPricing) return null;

  const currencySymbol = currencySymbols[pricing.currency || 'USD'] || '$';
  
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTotalPrice = () => {
    const base = pricing.basePrice || 0;
    const additional = pricing.additionalItems?.reduce((sum, item) => 
      sum + (item.amount || 0), 0) || 0;
    return base + additional;
  };

  return (
    <section 
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">{t('investment')}</h2>
        </div>
        <div className="space-y-4">
          {/* Base Price */}
          {pricing.basePrice && pricing.basePrice > 0 && (
            <div className="flex justify-between items-center py-3 border-b border-border/30">
              <span className="font-medium text-foreground">{t('base_price')}</span>
              <span className="text-lg font-semibold text-primary text-right">
                {currencySymbol}{formatPrice(pricing.basePrice)}
              </span>
            </div>
          )}

          {/* Additional Items */}
          {pricing.additionalItems && pricing.additionalItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {t('additional_items')}
              </h3>
              {pricing.additionalItems.map((item, index) => {
                if (!item.description?.trim()) return null;
                
                return (
                  <div key={item.id || index} className="flex justify-between items-center py-2">
                    <span className="text-foreground">{item.description}</span>
                    {item.amount && item.amount > 0 ? (
                      <span className="font-medium text-foreground text-right">
                        {currencySymbol}{formatPrice(item.amount)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">{t('included')}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Total */}
          {((pricing.basePrice && pricing.basePrice > 0) || 
            (pricing.additionalItems && pricing.additionalItems.some(item => item.amount && item.amount > 0))) && (
            <div className="flex justify-between items-center py-4 border-t border-border/30 mt-6">
              <span className="text-lg font-bold text-foreground">{t('total_investment')}</span>
              <span className="text-2xl font-bold text-primary text-right">
                {currencySymbol}{formatPrice(getTotalPrice())}
              </span>
            </div>
          )}

          {/* Currency Note */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            {t('all_prices_in')} {pricing.currency || 'USD'}
          </p>

          {/* Notes */}
          {pricing.notes && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/30">
              <h4 className="font-medium text-sm mb-2 text-foreground">{t('terms_conditions')}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {pricing.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
