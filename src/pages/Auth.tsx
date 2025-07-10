import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { Eye, EyeOff, Mail, Lock, User, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        if (!fullName.trim()) {
          toast({
            title: "Error",
            description: "Please enter your full name",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        result = await signUp(email, password, fullName);
      } else {
        result = await signIn(email, password);
      }

      if (result.error) {
        let errorMessage = result.error.message;
        
        // Handle specific error cases
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (errorMessage.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before signing in.';
        }

        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Account Created!",
            description: "Please check your email to confirm your account.",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <Card className="car-card border-border bg-card/95 backdrop-blur-sm shadow-elegant">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Logo size="lg" className="animate-float" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {isSignUp ? 'Join Bebington Motors' : 'Welcome Back'}
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                {isSignUp 
                  ? 'Create your account to start exploring premium vehicles' 
                  : 'Sign in to access exclusive automotive deals'
                }
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="luxury-input pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="luxury-input pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="luxury-input pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full premium-button hover:shadow-glow transition-smooth"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4" />
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail('');
                  setPassword('');
                  setFullName('');
                }}
                className="text-primary hover:text-primary-glow transition-smooth font-medium"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Feature highlights */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Premium Vehicles</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Expert Service</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Secure & Trusted</p>
          </div>
        </div>
      </div>
    </div>
  );
};