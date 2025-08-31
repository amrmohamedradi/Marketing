import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, LogIn, Loader2, User, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useAppContext } from "@/lib/AppContext";


import { useIsMobile, useIsExtraSmall } from "@/hooks/use-mobile";

const LoginForm = () => {
  const { t, changeLanguage, currentLanguage } = useI18n();
  const { setIsLoggedIn } = useAppContext();
  const isMobile = useIsMobile();
  const isExtraSmall = useIsExtraSmall();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true); // Use setIsLoggedIn from context
    }, 1000);
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
                <User className={`${isExtraSmall ? 'w-8 h-8' : 'w-10 h-10'} text-white`} />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={`${isExtraSmall ? 'text-2xl' : isMobile ? 'text-3xl' : 'text-4xl'} font-black text-foreground mb-3`}
            >
              {t('welcome_back')}
            </motion.h1>
            {/* Enhanced Language Toggle */}
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
                  {t('sign_in')}
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  {t('sign_in_desc_card')}
                </CardDescription>
              </CardHeader>
              <CardContent className={`${isExtraSmall ? 'space-y-3' : 'space-y-4'}`}>
                {/* Enhanced Form */}
                <form onSubmit={handleSubmit} className={`${isExtraSmall ? 'space-y-5' : 'space-y-8'}`}>
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full ${isExtraSmall ? 'px-4 py-3 text-base' : isMobile ? 'px-5 py-3.5 text-lg' : 'px-6 py-4 text-lg'} card-neo border-primary/30 rounded-xl xs:rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300`}
                        placeholder={t('enter_email')}
                        required
                      />
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-t-xl xs:rounded-t-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>

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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full ${isExtraSmall ? 'px-4 py-3 text-base' : isMobile ? 'px-5 py-3.5 text-lg' : 'px-6 py-4 text-lg'} card-neo border-primary/30 rounded-xl xs:rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300`}
                        placeholder={t('enter_password')}
                        required
                      />
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-t-xl xs:rounded-t-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
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
                            <span className={isExtraSmall ? 'text-base' : 'text-xl'}>{t('signing_in')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4">
                            <LogIn className={`${isExtraSmall ? 'w-5 h-5' : 'w-6 h-6'}`} />
                            <span className={isExtraSmall ? 'text-base' : 'text-xl'}>{t('sign_in')}</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                </form>    
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

export default LoginForm;