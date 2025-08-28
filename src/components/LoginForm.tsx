import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, LogIn, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useAppContext } from "@/lib/AppContext";

interface LoginFormProps {
  // onLogin: () => void; // Removed, now using useAppContext
}

const LoginForm = ({ /* onLogin */ }: LoginFormProps) => {
  const { t, changeLanguage, currentLanguage } = useI18n();
  const { setIsLoggedIn } = useAppContext(); // Use setIsLoggedIn from context
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-background p-4"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
            <img src="src/assets/logo.webp" className="h-10 w-10 rounded-full" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            {t('welcome_back')}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t('sign_in_desc')}
          </p>
        </motion.div>
        
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Language Toggle Button */}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    {t('email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('email_placeholder')}
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    {t('password')}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={t('password_placeholder')}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="bg-input border-border text-foreground focus:ring-ring focus:border-primary transition-all duration-200"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-md transition-all duration-300 ease-in-out hover:scale-[1.01] active:scale-95"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('signing_in')}
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      {t('sign_in')}
                    </>
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-center text-muted-foreground">
                {t('demo_notice')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginForm;