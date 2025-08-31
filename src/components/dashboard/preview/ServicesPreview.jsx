import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { i18nText } from '@/lib/i18nText';
import { useI18n } from '@/lib/i18n';

export default function ServicesPreview({ data, lang }) {
  const { t } = useI18n();
  const services = data?.services || [];
  if (!services.length) return null;

  return (
    <div className="relative py-4 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-28 h-28 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl animate-pulse" />
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
              {t('services_included')}
            </span>
          </motion.h2>
        </div>

        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 hover:opacity-100 transition-all duration-500 animate-pulse" />
          <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl h-full transform-gpu transition-all duration-500 hover:border-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.filter(service => {
                const items = service.subServices || service.items || [];
                return items.length > 0; // Only show services with items
              }).map((service, index) => {
                const Icon = service.icon;
                // ✅ Safe string conversion to prevent React error #130
                const serviceName = typeof service.name === 'object' && service.name !== null
                  ? (typeof service.name[lang] === 'string' ? service.name[lang] : '') ||
                    (typeof service.name[lang === 'ar' ? 'en' : 'ar'] === 'string' ? service.name[lang === 'ar' ? 'en' : 'ar'] : '') ||
                    ''
                  : typeof service.title === 'object' && service.title !== null
                  ? (typeof service.title[lang] === 'string' ? service.title[lang] : '') ||
                    (typeof service.title[lang === 'ar' ? 'en' : 'ar'] === 'string' ? service.title[lang === 'ar' ? 'en' : 'ar'] : '') ||
                    ''
                  : String(service.name || service.title || '');
                
                const serviceDesc = typeof service.description === 'object' && service.description !== null
                  ? (typeof service.description[lang] === 'string' ? service.description[lang] : '') ||
                    (typeof service.description[lang === 'ar' ? 'en' : 'ar'] === 'string' ? service.description[lang === 'ar' ? 'en' : 'ar'] : '') ||
                    ''
                  : String(service.description || '');
                
                if (!serviceName) return null;
                
                return (
                  <motion.div
                    key={service.id || index}
                    initial={{ y: 30, opacity: 0, scale: 0.9 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3, ease: "easeOut" }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group/item relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        {Icon && (
                          <div className="p-2 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-lg">
                            <Icon className="w-5 h-5 text-blue-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-base text-white mb-2 group-hover/item:text-blue-400 transition-colors duration-300">
                            {serviceName}
                          </h3>
                          {serviceDesc && (
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {serviceDesc}
                            </p>
                          )}
                        </div>
                      </div>

                      {(service.subServices || service.items || []).length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-semibold text-sm text-gray-400 uppercase tracking-wide">
                            {t('included_items')}
                          </h4>
                          <div className="space-y-2">
                            {(service.subServices || service.items || []).map((subService, subIndex) => {
                              // ✅ Convert objects to strings safely - prevent React error #130
                              const itemName = typeof subService.name === 'object' && subService.name !== null
                                ? (typeof subService.name.ar === 'string' ? subService.name.ar : '')
                                  || (typeof subService.name.en === 'string' ? subService.name.en : '')
                                  || ''
                                : typeof subService.text === 'object' && subService.text !== null
                                ? (typeof subService.text.ar === 'string' ? subService.text.ar : '')
                                  || (typeof subService.text.en === 'string' ? subService.text.en : '')
                                  || ''
                                : typeof subService === 'string' ? subService
                                : String(subService.name || subService.text || '');
                              
                              const itemDesc = typeof subService.description === 'object' && subService.description !== null
                                ? (typeof subService.description.ar === 'string' ? subService.description.ar : '')
                                  || (typeof subService.description.en === 'string' ? subService.description.en : '')
                                  || ''
                                : String(subService.description || '');
                              
                              if (!itemName) return null;
                              
                              return (
                                <div key={subService.id || subIndex} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-gray-300">{itemName}</p>
                                    {itemDesc && (
                                      <p className="text-xs text-gray-400 mt-1">{itemDesc}</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
