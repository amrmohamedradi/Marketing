import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Star, Clock, Zap, Users, Lock, CheckCircle, Sparkles 
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const Support = () => {
  const { t } = useI18n();

  const supportItems = [
    { icon: Clock, title: t('support_24_7_title'), desc: t('support_24_7_description'), gradient: 'from-cyan-400 to-blue-600' },
    { icon: Star, title: t('quality_guarantee_title'), desc: t('quality_guarantee_description'), gradient: 'from-amber-400 to-orange-600' },
    { icon: Zap, title: t('on_time_delivery_title'), desc: t('on_time_delivery_description'), gradient: 'from-emerald-400 to-teal-600' },
    { icon: Users, title: t('dedicated_team_title'), desc: t('dedicated_team_description'), gradient: 'from-violet-400 to-purple-600' },
    { icon: Lock, title: t('secure_process_title'), desc: t('secure_process_description'), gradient: 'from-rose-400 to-pink-600' },
    { icon: CheckCircle, title: t('fast_turnaround_title'), desc: t('fast_turnaround_description'), gradient: 'from-lime-400 to-green-600' }
  ];

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Custom Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-xl animate-pulse delay-2000" />
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <motion.div
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative max-w-7xl mx-auto px-4"
      >
        {/* Unique Header Design */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative inline-block mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 animate-pulse" />
            <div className="relative bg-black/90 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Elite Support Experience
                </span>
                <Shield className="w-6 h-6 text-purple-400 animate-bounce" />
              </div>
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-black mb-4 tracking-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              {t('support_benefits')}
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t('support_benefits_desc')}
          </motion.p>
        </div>

        {/* Custom Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {supportItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ y: 100, opacity: 0, rotateX: -15 }}
              whileInView={{ y: 0, opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: 0.8 + index * 0.15, 
                duration: 0.8, 
                ease: "easeOut",
                type: "spring",
                bounce: 0.3
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group relative perspective-1000"
            >
              {/* Unique Card Design */}
              <div className="relative h-full">
                {/* Animated Border */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse`} />
                
                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 p-8 rounded-2xl h-full transform-gpu transition-all duration-500 group-hover:border-transparent">
                  
                  {/* Floating Icon */}
                  <motion.div
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="relative mb-6"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl blur-md opacity-75`} />
                    <div className="relative bg-black/80 p-4 rounded-xl border border-gray-600/50">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                      {item.title}
                    </h3>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent group-hover:via-purple-400 transition-all duration-500" />
                    
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>

                  {/* Corner Accent */}
                  <div className={`absolute top-3 right-3 w-3 h-3 bg-gradient-to-br ${item.gradient} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        />
      </motion.div>
    </div>
  );
};

export default Support;
