import React from 'react';
import { motion } from 'framer-motion';
import { User, Building, Mail, Phone } from 'lucide-react';
import { i18nText } from '@/lib/i18nText';
import { useI18n } from '@/lib/i18n';

export default function AboutClientPreview({ data, lang }) {
  const { t } = useI18n();
  const client = data?.client || data?.clientDetails;
  if (!client) return null;

  const hasAnyField = client.name || client.company || client.email || client.phone;
  if (!hasAnyField) return null;

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
              {t('client_details')}
            </span>
          </motion.h2>
        </div>

        <div className="relative h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm opacity-0 hover:opacity-100 transition-all duration-500 animate-pulse" />
          <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl h-full transform-gpu transition-all duration-500 hover:border-transparent">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {client.name && (
                <motion.div
                  initial={{ y: 30, opacity: 0, scale: 0.9 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group/item relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-lg">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-white mb-2 group-hover/item:text-blue-400 transition-colors duration-300">
                          {t('name')}
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {i18nText(client.name, lang)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {client.company && (
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
                        <Building className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-white mb-2 group-hover/item:text-purple-400 transition-colors duration-300">
                          {t('company')}
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {i18nText(client.company, lang)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {client.email && (
                <motion.div
                  initial={{ y: 30, opacity: 0, scale: 0.9 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group/item relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-green-400/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-lg">
                        <Mail className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-white mb-2 group-hover/item:text-green-400 transition-colors duration-300">
                          {t('email')}
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {i18nText(client.email, lang)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {client.phone && (
                <motion.div
                  initial={{ y: 30, opacity: 0, scale: 0.9 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.3, ease: "easeOut" }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group/item relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-amber-400/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-lg">
                        <Phone className="w-5 h-5 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base text-white mb-2 group-hover/item:text-amber-400 transition-colors duration-300">
                          {t('phone')}
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {i18nText(client.phone, lang)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {client.description && (
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
                className="mt-8 group/item relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-500/5 rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-xl hover:border-pink-400/30 transition-all duration-300 hover:shadow-lg">
                  <h4 className="font-semibold text-lg text-white mb-4 group-hover/item:text-pink-400 transition-colors duration-300">
                    {t('project_description')}
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {i18nText(client.description, lang)}
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
