import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="w-full max-w-sm">
        {/* Auth Card */}
        <Card className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-semibold text-white mb-2">
              {isSignUp ? 'Log In' : 'Log In'}
            </CardTitle>
            <p className="text-slate-300 text-sm">
              {isSignUp ? 'Log in or create a NFL Plays Breakdown account' : 'Welcome back to NFL Plays Breakdown'}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 h-12 rounded-xl px-4"
                  placeholder="Enter your subscription email"
                />
                
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400 h-12 rounded-xl px-4"
                  placeholder="Enter your password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Continue')}
              </Button>
            </form>

            <div className="text-center space-y-3">
              <Button
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-slate-400 hover:text-white text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSkip}
                className="w-full h-10 bg-transparent border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-xl text-sm"
              >
                Preview NFL Plays Breakdown
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;