import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, Sparkles } from "lucide-react";

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 fade-in">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 text-primary">
              <Sparkles className="h-8 w-8" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ServiceSpec
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to create beautiful service specifications for your clients
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="card-gradient scale-in">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Use any credentials to access the demo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@servicespec.com"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="input-enhanced"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter any password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
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
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            This is a demo app. Use any email and password to continue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;