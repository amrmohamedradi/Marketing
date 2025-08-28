import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, LogIn, Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const { t, changeLanguage, currentLanguage } = useI18n();
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
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* <div className="mx-auto h-12 w-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
            <img src="src/assets/logo.webp" className="h-10 w-10 rounded-full" />
          </div> */}
          <h2 className="text-3xl font-bold text-foreground">
            {t('welcome_back')}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t('sign_in_desc')}
          </p>
        </div>
        
        <Card className="card-gradient">
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
              <div className="flex justify-end mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="btn-ghost-primary"
                  onClick={() => changeLanguage(currentLanguage === 'ar' ? 'en' : 'ar')}
                >
                  {currentLanguage === 'ar' ? 'English' : 'العربية'}
                </Button>
              </div>

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
                  className="input-enhanced"
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
                  className="input-enhanced"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full btn-gradient"
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
      </div>
    </div>
  );
};

export default LoginForm;