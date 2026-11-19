import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface ErrorResponse {
  message: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, createAnonymousSession, isLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      };
      await login(loginData);
      navigate('/');
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleAnonymousLogin = async () => {
    setError('');
    
    try {
      await createAnonymousSession();
      navigate('/chatbot');
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      setError(error.message || 'Anonymous session creation failed.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/meditation-white.png" alt="Calmify Logo" className="h-12 w-auto object-contain" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Calmify</h1>
          </div>
          <p className="text-muted-foreground">
            Your safe space for mental health support
          </p>
        </div>

        <div className="rounded-3xl shadow-2xl backdrop-blur-md p-8 bg-card/90 border border-border">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold mb-2 text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground text-sm">
              Sign in to continue your journey to better mental health
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <div className="p-4 bg-destructive/15 border border-destructive/30 rounded-xl">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-foreground">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="bg-background/60 border-border text-foreground focus:border-primary focus:ring-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="rounded border-border text-primary focus:ring-primary bg-background"
                  disabled={isLoading}
                />
                <Label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <button 
                type="submit" 
                className="w-full px-8 py-3.5 text-primary-foreground bg-primary hover:bg-primary/90 text-base font-semibold rounded-full transition-all duration-300 ease-out hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-card text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <button 
                type="button" 
                className="w-full px-8 py-3.5 font-semibold rounded-full transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed bg-muted/40 hover:bg-muted/70 border border-border text-foreground"
                onClick={handleAnonymousLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating session...
                  </div>
                ) : (
                  'Continue Anonymously'
                )}
              </button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
