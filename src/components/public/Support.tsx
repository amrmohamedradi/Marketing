import React from 'react';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useI18n } from '@/lib/i18n';
import { CheckCircle, Clock, Shield, Users, Zap, HeadphonesIcon, BarChart3, Award } from 'lucide-react';

interface SupportFeature {
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descriptionKey: string;
}

const supportFeatures: SupportFeature[] = [
  {
    icon: HeadphonesIcon,
    titleKey: 'monthly_checkins_title',
    descriptionKey: 'monthly_checkins_description'
  },
  {
    icon: Clock,
    titleKey: 'bug_fix_sla_title',
    descriptionKey: 'bug_fix_sla_description'
  },
  {
    icon: BarChart3,
    titleKey: 'performance_monitoring_title',
    descriptionKey: 'performance_monitoring_description'
  },
  {
    icon: Users,
    titleKey: 'dedicated_team_title',
    descriptionKey: 'dedicated_team_description'
  },
  {
    icon: Zap,
    titleKey: 'fast_turnaround_title',
    descriptionKey: 'fast_turnaround_description'
  },
  {
    icon: Shield,
    titleKey: 'security_updates_title',
    descriptionKey: 'security_updates_description'
  },
  {
    icon: Award,
    titleKey: 'quality_guarantee_title',
    descriptionKey: 'quality_guarantee_description'
  }
];

export default function Support() {
  const { t } = useI18n();
  const { isVisible, ref } = useRevealOnScroll();

  return (
    <section 
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/50 p-8 shadow-sm relative overflow-hidden">
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 rounded-2xl" />
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 text-center">{t('support')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start space-x-4 rtl:space-x-reverse p-4 rounded-lg bg-background/50 border border-border/30 hover:bg-background/80 hover:border-primary/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary mt-1 group-hover:scale-110 group-hover:text-accent transition-all duration-300" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-semibold text-foreground mb-2 leading-tight">
                      {t(feature.titleKey)}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
