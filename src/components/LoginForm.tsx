import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, LogIn, Loader2, User, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useAppContext } from "@/lib/AppContext";


const LoginForm = () => {
  const { t, changeLanguage, currentLanguage } = useI18n();
  const { setIsLoggedIn } = useAppContext(); // Use setIsLoggedIn from context
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
      className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden"
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

      <div className="w-full max-w-lg relative z-10">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="border-primary/60 border border-primary/20 rounded-3xl shadow-lg p-12 hover:scale-105"
        >
          {/* Enhanced Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", bounce: 0.3 }}
              className="relative inline-block mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-lg animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-3xl flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-4xl font-black text-foreground mb-3"
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
                  className="card-neo border-primary/20 text-foreground hover:border-primary/40 px-6 py-3 rounded-xl transition-all duration-300 font-medium"
                >
                  <Globe className="w-5 h-5 mr-3" />
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
            <Card className="rounded-2xl shadow-lg border border-border bg-card text-card-foreground p-4">
              <CardHeader>
                <CardTitle className="text-center text-foreground">
                  {t('sign_in')}
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  {t('sign_in_desc_card')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enhanced Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="relative"
                  >
                    <Label htmlFor="email" className="text-base font-semibold text-foreground mb-3 block">
                      {t('email_address')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-6 py-4 text-lg card-neo border-primary/30 rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        placeholder={t('enter_email')}
                        required
                      />
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-t-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="relative"
                  >
                    <Label htmlFor="password" className="text-base font-semibold text-foreground mb-3 block">
                      {t('password')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-6 py-4 text-lg card-neo border-primary/30 rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        placeholder={t('enter_password')}
                        required
                      />
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-t-2xl opacity-0 focus-within:opacity-100 transition-opacity duration-300" />
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
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-50" />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="relative w-full py-6 text-xl font-bold rounded-2xl bg-gradient-to-r from-primary via-accent to-primary text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500 disabled:opacity-40"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            {t('signing_in')}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-4">
                            <LogIn className="w-6 h-6" />
                            {t('sign_in')}
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