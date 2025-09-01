import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, LogIn, Loader2, User, Globe, Mail, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useAppContext } from "@/lib/AppContext";
import { useIsMobile, useIsExtraSmall } from "@/hooks/use-mobile";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const { t, changeLanguage, currentLanguage } = useI18n();
  const { setIsLoggedIn } = useAppContext();
  const isMobile = useIsMobile();
  const isExtraSmall = useIsExtraSmall();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('name_required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('email_invalid');
    }
    
    if (!formData.password) {
      newErrors.password = t('password_required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('password_min_length');
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('password_mismatch');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call to backend
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center bg-background p-2 xs:p-3 sm:p-4 relative overflow-hidden"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Modern Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 mesh-bg opacity-20" />
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/95" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 0.8, 1.1, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-accent/15 to-primary/25 rounded-full blur-3xl"
        />
      </div>

      <div className={`w-full ${isExtraSmall ? 'max-w-sm' : isMobile ? 'max-w-md' : 'max-w-lg'} relative z-10`}>
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={`border-primary/60 border border-primary/20 rounded-2xl xs:rounded-3xl shadow-lg ${isExtraSmall ? 'p-4' : isMobile ? 'p-6' : 'p-12'} hover:scale-105`}
        >
          {/* Enhanced Header */}
          <div className={`text-center ${isExtraSmall ? 'mb-6' : isMobile ? 'mb-8' : 'mb-10'}`}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", bounce: 0.3 }}
              className={`relative inline-block ${isExtraSmall ? 'mb-4' : isMobile ? 'mb-6' : 'mb-8'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl xs:rounded-3xl blur-lg animate-pulse" />
              <div className={`relative ${isExtraSmall ? 'w-16 h-16' : 'w-20 h-20'} bg-gradient-to-r from-primary to-accent rounded-2xl xs:rounded-3xl flex items-center justify-center`}>
                <UserPlus className={`${isExtraSmall ? 'w-8 h-8' : 'w-10 h-10'} text-white`} />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={`${isExtraSmall ? 'text-2xl' : isMobile ? 'text-3xl' : 'text-4xl'} font-black text-foreground mb-3`}
            >
              {t('create_account')}
            </motion.h1>
            
            {/* Language Toggle */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-6 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => changeLanguage(currentLanguage === 'ar' ? 'en' : 'ar')}
                  className={`card-neo border-primary/20 text-foreground hover:border-primary/40 ${isExtraSmall ? 'px-4 py-2 text-sm' : 'px-6 py-3'} rounded-xl transition-all duration-300 font-medium`}
                >
                  <Globe className={`${isExtraSmall ? 'w-4 h-4 mr-2' : 'w-5 h-5 mr-3'}`} />
                  {currentLanguage === 'ar' ? 'English' : 'العربية'}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className={`rounded-xl xs:rounded-2xl shadow-lg border border-border bg-card text-card-foreground ${isExtraSmall ? 'p-2' : isMobile ? 'p-3' : 'p-4'}`}>
              <CardHeader>
                <CardTitle className="text-center text-foreground">
                  {t('join_us')}
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  {t('signup_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className={`${isExtraSmall ? 'space-y-3' : 'space-y-4'}`}>
                <form onSubmit={handleSubmit} className={`${isExtraSmall ? 'space-y-4' : 'space-y-6'}`}>
                  {/* Name Field */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative"
                  >
                    <Label htmlFor="name" className={`${isExtraSmall ? 'text-sm' : 'text-base'} font-semibold text-foreground ${isExtraSmall ? 'mb-2' : 'mb-3'} block`}>
                      {t('full_name')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`w-full ${isExtraSmall ? 'px-4 py-3 text-base' : isMobile ? 'px-5 py-3.5 text-lg' : 'px-6 py-4 text-lg'} card-neo border-primary/30 rounded-xl xs:rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${errors.name ? 'border-red-500' : ''}`}
                        placeholder={t('enter_full_name')}
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="relative"
                  >
                    <Label htmlFor="email" className={`${isExtraSmall ? 'text-sm' : 'text-base'} font-semibold text-foreground ${isExtraSmall ? 'mb-2' : 'mb-3'} block`}>
                      {t('email_address')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full ${isExtraSmall ? 'px-4 py-3 text-base' : isMobile ? 'px-5 py-3.5 text-lg' : 'px-6 py-4 text-lg'} card-neo border-primary/30 rounded-xl xs:rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${errors.email ? 'border-red-500' : ''}`}
                        placeholder={t('enter_email')}
                        required
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="relative"
                  >
                    <Label htmlFor="password" className={`${isExtraSmall ? 'text-sm' : 'text-base'} font-semibold text-foreground ${isExtraSmall ? 'mb-2' : 'mb-3'} block`}>
                      {t('password')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`w-full ${isExtraSmall ? 'px-4 py-3 text-base' : isMobile ? 'px-5 py-3.5 text-lg' : 'px-6 py-4 text-lg'} card-neo border-primary/30 rounded-xl xs:rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${errors.password ? 'border-red-500' : ''}`}
                        placeholder={t('enter_password')}
                        required
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Confirm Password Field */}
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="relative"
                  >
                    <Label htmlFor="confirmPassword" className={`${isExtraSmall ? 'text-sm' : 'text-base'} font-semibold text-foreground ${isExtraSmall ? 'mb-2' : 'mb-3'} block`}>
                      {t('confirm_password')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`w-full ${isExtraSmall ? 'px-4 py-3 text-base' : isMobile ? 'px-5 py-3.5 text-lg' : 'px-6 py-4 text-lg'} card-neo border-primary/30 rounded-xl xs:rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        placeholder={t('confirm_password_placeholder')}
                        required
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r from-primary to-accent ${isExtraSmall ? 'rounded-xl' : 'rounded-2xl'} blur-lg opacity-50`} />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className={`relative w-full ${isExtraSmall ? 'py-4 text-lg rounded-xl' : isMobile ? 'py-5 text-xl rounded-xl' : 'py-6 text-xl rounded-2xl'} font-bold bg-gradient-to-r from-primary via-accent to-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500 disabled:opacity-40`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4">
                            <div className={`${isExtraSmall ? 'w-5 h-5' : 'w-6 h-6'} border-3 border-white/30 border-t-white rounded-full animate-spin`} />
                            <span className={isExtraSmall ? 'text-base' : 'text-xl'}>{t('creating_account')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4">
                            <UserPlus className={`${isExtraSmall ? 'w-5 h-5' : 'w-6 h-6'}`} />
                            <span className={isExtraSmall ? 'text-base' : 'text-xl'}>{t('create_account')}</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                </form>

                {/* Switch to Login */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="text-center pt-4 border-t border-border/30"
                >
                  <p className="text-sm text-muted-foreground mb-3">
                    {t('already_have_account')}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onSwitchToLogin}
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('sign_in')}
                  </Button>
                </motion.div>
                
                <p className="text-xs text-center text-muted-foreground">
                  {t('demo_notice')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignupForm;