import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import nflPlayerBg from '@/assets/nfl-player-bg.png';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect authenticated users to main page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      } else if (isSignUp) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen relative">
      {/* Full screen blurred background image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${nflPlayerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: '10% center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(3px)',
          transform: 'scale(1.1)'
        }}
      >
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/30"></div>
      
      {/* Auth dialog container */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left spacer */}
        <div className="flex-1"></div>
        
        {/* Right panel - Glassmorphic */}
        <div className="flex-1 flex items-center justify-center p-8 bg-glass-subtle backdrop-blur-xl">
        <div className="w-full max-w-md">
        {/* Auth Card */}
        <Card className="bg-card/80 backdrop-blur-xl border-border shadow-elegant rounded-2xl">
          <CardHeader className="text-center pb-6 pt-12">
            <CardTitle className="text-3xl font-semibold text-foreground mb-4">
              {isSignUp ? 'Welcome to NFL Plays Breakdown' : 'Welcome Back'}
            </CardTitle>
            <p className="text-muted-foreground text-base leading-relaxed">
              {isSignUp ? 'Create your account to access detailed NFL play analysis' : 'Sign in to continue your NFL analysis journey'}
            </p>
          </CardHeader>
          <CardContent className="space-y-8 px-12 pb-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl px-4 text-base transition-smooth focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl px-4 text-base transition-smooth focus:ring-2 focus:ring-primary"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-smooth shadow-sm"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="text-center space-y-4 pt-4">
              <Button
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-muted-foreground hover:text-foreground text-sm transition-smooth"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Create Account"
                }
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSkip}
                className="w-full h-12 bg-transparent border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-xl text-sm transition-smooth"
              >
                Preview NFL Plays Breakdown
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;