import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { i18nText } from '@/lib/i18nText';
import { useI18n } from '@/lib/i18n';

export default function SupportPreview({ data, lang }) {
  const { t } = useI18n();
  const items = data?.support?.items || [];
  if (!items.length) return null;

  return (
    <div className="relative py-4 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-28 h-28 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
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
              {t('support_benefits')}
            </span>
          </motion.h2>
        </div>

        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 hover:opacity-100 transition-all duration-500 animate-pulse" />
          <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl h-full transform-gpu transition-all duration-500 hover:border-transparent">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items.map((item, index) => {
                // ✅ Safe string conversion to prevent React error #130
                const title = typeof item?.title === 'object' && item?.title !== null
                  ? (typeof item.title[lang] === 'string' ? item.title[lang] : '') ||
                    (typeof item.title[lang === 'ar' ? 'en' : 'ar'] === 'string' ? item.title[lang === 'ar' ? 'en' : 'ar'] : '') ||
                    ''
                  : String(item?.title || '');
                
                const description = typeof item?.description === 'object' && item?.description !== null
                  ? (typeof item.description[lang] === 'string' ? item.description[lang] : '') ||
                    (typeof item.description[lang === 'ar' ? 'en' : 'ar'] === 'string' ? item.description[lang === 'ar' ? 'en' : 'ar'] : '') ||
                    ''
                  : String(item?.description || '');
                
                if (!title && !description) return null;
                
                return (
                  <motion.div
                    key={item.id ?? index}
                    initial={{ y: 30, opacity: 0, scale: 0.9 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.3, ease: "easeOut" }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group/item relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-pink-400/30 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-lg">
                          <Heart className="w-5 h-5 text-pink-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base text-white mb-2 group-hover/item:text-pink-400 transition-colors duration-300">
                            {/* ✅ Guard against rendering objects */}
                            {typeof title === 'string' ? title : t(typeof item?.title === 'string' ? item.title : 'support_item')}
                          </h3>
                          {description && (
                            <p className="text-sm text-gray-300 leading-relaxed">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>
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
