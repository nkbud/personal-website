import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { toast } = useToast();

  const ADMIN_EMAIL = "nicholasbudzban@gmail.com";

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAdmin(currentSession?.user?.email === ADMIN_EMAIL);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAdmin(currentSession?.user?.email === ADMIN_EMAIL);
        setLoading(false);
        if (event === 'SIGNED_IN') {
          toast({ title: "Signed In", description: "Welcome back!"});
          setAuthModalOpen(false); // Close modal on successful sign-in
        }
        if (event === 'SIGNED_OUT') {
          toast({ title: "Signed Out", description: "You have been successfully signed out."});
        }
         if (event === 'USER_UPDATED') {
          // Could be useful for profile updates later
        }
        if (event === "PASSWORD_RECOVERY") {
          toast({ title: "Password Recovery", description: "Password recovery email sent. Please check your inbox." });
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [toast]);

  const signInWithEmail = async (email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Sign In Error", description: error.message, variant: "destructive"});
    }
    // Auth listener handles success
    setLoading(false);
    return { error };
  };

  const signUpWithEmail = async (email, password, fullName = '') => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) {
      toast({ title: "Sign Up Error", description: error.message, variant: "destructive"});
    } else if (data.user && !data.session) {
       toast({ title: "Sign Up Successful!", description: "Please check your email to confirm your account."});
       setAuthModalOpen(false);
    }
    // Auth listener handles session creation after confirmation
    setLoading(false);
    return { data, error };
  };
  
  const requestPasswordReset = async (email) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, // You'll need a page/route for this
    });
    if (error) {
      toast({ title: "Password Reset Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password Reset Email Sent", description: "If an account exists for this email, a password reset link has been sent." });
      setAuthModalOpen(false);
    }
    setLoading(false);
    return { error };
  };


  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
       toast({ title: "Sign Out Error", description: error.message, variant: "destructive"});
    }
    // Auth listener will handle state updates
    setLoading(false);
  };

  const value = {
    session,
    user,
    isAdmin,
    signInWithEmail,
    signUpWithEmail,
    requestPasswordReset,
    signOut,
    loading,
    authModalOpen,
    setAuthModalOpen,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};