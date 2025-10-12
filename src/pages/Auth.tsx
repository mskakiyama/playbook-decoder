import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AuthUI } from '@/components/ui/auth-fuse';
import nflPlayerBg from '@/assets/nfl-player-bg.png';

const Auth = () => {
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

  const handleSignIn = async (email: string, password: string) => {
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
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
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

  const handleSignUp = async (email: string, password: string) => {
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
      const { error } = await signUp(email, password);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
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
    <AuthUI
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      onSkip={handleSkip}
      loading={loading}
      signInContent={{
        image: {
          src: nflPlayerBg,
          alt: "NFL Player Background"
        },
        quote: {
          text: "Welcome Back! Dive into the game.",
          author: "NFL Plays Breakdown"
        }
      }}
      signUpContent={{
        image: {
          src: nflPlayerBg,
          alt: "NFL Player Background"
        },
        quote: {
          text: "Join us. Analyze every play.",
          author: "NFL Plays Breakdown"
        }
      }}
    />
  );
};

export default Auth;