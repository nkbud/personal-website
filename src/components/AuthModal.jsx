import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Key, UserPlus, LogIn, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AuthModal = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // For sign up
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signInWithEmail, signUpWithEmail, requestPasswordReset } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let result;
    if (isPasswordReset) {
        result = await requestPasswordReset(email);
    } else if (isSignUp) {
      result = await signUpWithEmail(email, password, fullName);
    } else {
      result = await signInWithEmail(email, password);
    }
    
    if (result?.error) {
      setError(result.error.message);
    } else {
      // Success is handled by AuthContext listener (toast & closing modal)
      // For signup confirmation email, message is shown by AuthContext
      if (!isSignUp || (result?.data?.session)) { // Don't close for signup if confirmation needed
         // onClose(); // AuthContext now closes modal on SIGNED_IN
      }
    }
    setLoading(false);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
  };
  
  const renderFormContent = () => {
    if (isPasswordReset) {
      return (
        <>
          <h3 className="text-xl font-semibold mb-1 text-foreground">Reset Password</h3>
          <p className="text-sm text-muted-foreground mb-6">Enter your email to receive a password reset link.</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-reset">Email</Label>
              <Input id="email-reset" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <h3 className="text-xl font-semibold mb-6 text-foreground">{isSignUp ? 'Create Account' : 'Sign In'}</h3>
        <div className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your Name" />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
        </div>
      </>
    );
  };

  const renderButtonText = () => {
    if (loading) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
        />
      );
    }
    if (isPasswordReset) return <><RotateCcw className="mr-2 h-4 w-4"/>Send Reset Link</>;
    if (isSignUp) return <><UserPlus className="mr-2 h-4 w-4"/>Sign Up</>;
    return <><LogIn className="mr-2 h-4 w-4"/>Sign In</>;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-background text-foreground rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-end p-3 border-b border-border">
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close form">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {renderFormContent()}

            {error && (
              <motion.div 
                initial={{opacity: 0, y: -10}} animate={{opacity:1, y:0}}
                className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md text-sm flex items-start"
              >
                <AlertCircle className="h-5 w-5 mr-2 shrink-0" /> 
                {error}
              </motion.div>
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {renderButtonText()}
            </Button>

            <div className="text-sm text-center">
              {isPasswordReset ? (
                <button type="button" onClick={() => { setIsPasswordReset(false); setIsSignUp(false); setError(''); }} className="font-medium text-primary hover:underline">
                  Back to Sign In
                </button>
              ) : isSignUp ? (
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <button type="button" onClick={() => { setIsSignUp(false); setError(''); }} className="font-medium text-primary hover:underline">
                    Sign In
                  </button>
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => { setIsSignUp(true); setError(''); }} className="font-medium text-primary hover:underline">
                      Sign Up
                    </button>
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    <button type="button" onClick={() => { setIsPasswordReset(true); setError(''); }} className="font-medium text-primary hover:underline text-xs">
                      Forgot Password?
                    </button>
                  </p>
                </>
              )}
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;