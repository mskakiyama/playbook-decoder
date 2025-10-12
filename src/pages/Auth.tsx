import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SignInPage, Testimonial } from '@/components/ui/sign-in';
import nflPlayerBg from '@/assets/nfl-player-bg.png';

const testimonials: Testimonial[] = [
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Tom Brady Fan",
    handle: "@nflfanatic",
    text: "This platform has completely transformed how I analyze NFL plays. Essential for any football enthusiast!"
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Sarah Johnson",
    handle: "@sportsanalyst",
    text: "The detailed breakdowns and play-by-play analysis are unmatched. A must-have for serious NFL fans."
  },
  {
    avatarSrc: "https://randomuser.me/api/portraits/men/67.jpg",
    name: "Mike Davis",
    handle: "@coachmiked",
    text: "As a coach, this tool helps me study game footage efficiently. The insights are incredibly valuable."
  },
];

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
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

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

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

  const handleGoogleSignIn = () => {
    toast({
      title: "Coming Soon",
      description: "Google sign-in will be available soon!",
    });
  };

  const handleResetPassword = () => {
    toast({
      title: "Reset Password",
      description: "Password reset functionality coming soon!",
    });
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <SignInPage
      title={
        isSignUp ? (
          <span className="font-light text-foreground tracking-tighter">Create Account</span>
        ) : (
          <span className="font-light text-foreground tracking-tighter">Welcome Back</span>
        )
      }
      description={
        isSignUp
          ? "Join NFL Plays Breakdown and start analyzing every play like a pro"
          : "Access your account and dive deep into NFL play analysis"
      }
      heroImageSrc={nflPlayerBg}
      testimonials={testimonials}
      onSignIn={handleFormSubmit}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleToggleMode}
      loading={loading}
      showSignUp={isSignUp}
    />
  );
};

export default Auth;