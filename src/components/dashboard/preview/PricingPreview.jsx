import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { i18nText } from '@/lib/i18nText';
import { useI18n } from '@/lib/i18n';

export default function PricingPreview({ data, lang }) {
  const { t } = useI18n();
  const priceData = data?.pricing || data?.priceData;
  if (!priceData || priceData.basePrice === 0) return null;

  const selectedCurrency = [
    { value: "USD", symbol: "$" },
    { value: "EUR", symbol: "€" },
    { value: "GBP", symbol: "£" },
    { value: "CAD", symbol: "C$" },
    { value: "AUD", symbol: "A$" },
    { value: "AED", symbol: "د.إ" },
    { value: "SAR", symbol: "ر.س" },
    { value: "QAR", symbol: "ر.ق" },
    { value: "KWD", symbol: "د.ك" },
    { value: "EGP", symbol: "ج.م" },
  ].find(c => c.value === priceData.currency) || { value: "USD", symbol: "$" };

  const getTotalPrice = () => {
    return priceData.basePrice + (priceData.additionalItems || []).reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="relative py-4 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-28 h-28 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>
      
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative max-w-7xl mx-auto"
      >
        <div className="text-center mb-4">
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-4xl font-black mb-0 tracking-tight"
          >
            <span className="text-white">
              {t('pricing')}
            </span>
          </motion.h2>
        </div>

        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl blur-sm opacity-0 hover:opacity-100 transition-all duration-500 animate-pulse" />
          <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl h-full transform-gpu transition-all duration-500 hover:border-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Base Price */}
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group/item relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-green-400/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-white mb-2 group-hover/item:text-green-400 transition-colors duration-300">
                        {t('base_price')}
                      </h3>
                      <p className="text-2xl font-bold text-green-400">
                        {selectedCurrency.symbol}{formatPrice(priceData.basePrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Total Investment */}
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.3, ease: "easeOut" }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group/item relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-purple-400/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-white mb-2 group-hover/item:text-purple-400 transition-colors duration-300">
                        {t('total_price')}
                      </h3>
                      <p className="text-3xl font-bold text-purple-400">
                        {selectedCurrency.symbol}{formatPrice(getTotalPrice())}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            
            {/* Additional Items */}
            {(priceData.additionalItems || []).length > 0 && (
              <div className="md:col-span-2 mt-8">
                <h4 className="font-semibold text-lg text-white mb-4">
                  {t('additional_items')}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {priceData.additionalItems.map((item, index) => {
                    // ✅ Safe string conversion to prevent React error #130
                    const itemDesc = typeof item.description === 'object' && item.description !== null
                      ? (typeof item.description[lang] === 'string' ? item.description[lang] : '') ||
                        (typeof item.description[lang === 'ar' ? 'en' : 'ar'] === 'string' ? item.description[lang === 'ar' ? 'en' : 'ar'] : '') ||
                        ''
                      : String(item.description || '');
                    
                    if (!itemDesc) return null;
                    
                    return (
                      <motion.div
                        key={item.id || index}
                        initial={{ y: 30, opacity: 0, scale: 0.9 }}
                        whileInView={{ y: 0, opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.05, duration: 0.3, ease: "easeOut" }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="group/item relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                        <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-amber-400/30 transition-all duration-300 hover:shadow-lg">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-lg">
                              <DollarSign className="w-5 h-5 text-amber-400" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-base text-white mb-2 group-hover/item:text-amber-400 transition-colors duration-300">
                                {itemDesc}
                              </h3>
                              <p className="text-xl font-bold text-amber-400">
                                {selectedCurrency.symbol}{formatPrice(item.amount || 0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Price Notes */}
            {priceData.notes && (
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
                className="md:col-span-2 mt-8 group/item relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-pink-400/30 transition-all duration-300 hover:shadow-lg">
                  <h4 className="font-semibold text-lg text-white mb-4 group-hover/item:text-pink-400 transition-colors duration-300">
                    {t('additional_notes')}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {typeof priceData.notes === 'object' && priceData.notes !== null
                      ? (typeof priceData.notes[lang] === 'string' ? priceData.notes[lang] : '') ||
                        (typeof priceData.notes[lang === 'ar' ? 'en' : 'ar'] === 'string' ? priceData.notes[lang === 'ar' ? 'en' : 'ar'] : '') ||
                        ''
                      : String(priceData.notes || '')}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
