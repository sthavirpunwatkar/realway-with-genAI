
"use client";

import { useState, useEffect, useRef } from 'react';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase'; // Ensure this path is correct
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Smartphone } from 'lucide-react';

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOtpVerified: () => void; // Callback when OTP is successfully verified
  gateName: string | null;
}

// Extend window type to include recaptchaVerifier
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export function OtpDialog({ open, onOpenChange, onOtpVerified, gateName }: OtpDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phoneNumber' | 'otp'>('phoneNumber');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const auth = getFirebaseAuth(); // Get auth instance

  useEffect(() => {
    const currentRecaptchaDiv = recaptchaContainerRef.current;
    const currentAuth = auth; // Use the auth instance from component scope

    if (open && !window.recaptchaVerifier && currentAuth && currentRecaptchaDiv) {
      currentRecaptchaDiv.innerHTML = ''; // Clear container before new verifier
      const verifier = new RecaptchaVerifier(currentAuth, currentRecaptchaDiv, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          toast({
            title: 'reCAPTCHA Expired',
            description: 'Please try sending the OTP again.',
            variant: 'destructive',
          });
          window.recaptchaVerifier?.clear(); // Attempt to clear/reset

          const nodeInExpiredCb = recaptchaContainerRef.current;
          const authInExpiredCb = getFirebaseAuth(); // Re-fetch or ensure auth is valid

          if (nodeInExpiredCb) {
            nodeInExpiredCb.innerHTML = ''; // Clear container
            if (authInExpiredCb) {
              try {
                window.recaptchaVerifier = new RecaptchaVerifier(authInExpiredCb, nodeInExpiredCb, { size: 'invisible' });
                 setError('reCAPTCHA session expired. Please try sending OTP again.');
                 setStep('phoneNumber'); // Guide user back
              } catch (e) {
                 console.error("Error re-initializing RecaptchaVerifier in expired-callback:", e);
                 setError('Failed to reset reCAPTCHA. Please try sending OTP again.');
              }
            } else {
              setError("Authentication service became unavailable. Please close and try again.");
            }
           } else {
             setError("reCAPTCHA expired but dialog is in an unstable state. Please try sending OTP again.");
           }
        },
      });
      window.recaptchaVerifier = verifier;
    }
  }, [open, auth, toast]); // auth is stable if getFirebaseAuth() is robust

  const handleSendOtp = async () => {
    if (!phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890).');
      return;
    }
    setError(null);
    setIsLoading(true);

    const currentAuth = auth; // Use auth from component scope

    try {
      if (!window.recaptchaVerifier) {
        // Attempt to re-initialize if verifier is missing and dialog is open
        const currentRecaptchaDivForSend = recaptchaContainerRef.current;
        if (open && currentAuth && currentRecaptchaDivForSend) {
            currentRecaptchaDivForSend.innerHTML = '';
            window.recaptchaVerifier = new RecaptchaVerifier(currentAuth, currentRecaptchaDivForSend, {size: 'invisible'});
        } else {
            throw new Error('RecaptchaVerifier not initialized and cannot be re-initialized.');
        }
      }
      const confirmationResult = await signInWithPhoneNumber(
        currentAuth, // Use currentAuth
        phoneNumber,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      setStep('otp');
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${phoneNumber}.`,
      });
    } catch (err) {
      console.error('Error sending OTP:', err);
      const firebaseError = err as { code?: string; message?: string };
      setError(firebaseError.message || 'Failed to send OTP. Ensure reCAPTCHA is working and the phone number is correct.');
      toast({
        title: 'OTP Send Failed',
        description: firebaseError.message || 'Please check the console for details and ensure your Firebase setup is correct.',
        variant: 'destructive',
      });
       // Reset reCAPTCHA on failure to allow retry
      window.recaptchaVerifier?.clear();
      const nodeInErrorCb = recaptchaContainerRef.current;
      const authInErrorCb = getFirebaseAuth(); // Re-fetch or ensure auth is valid

      if (nodeInErrorCb) {
        nodeInErrorCb.innerHTML = '';
        if (authInErrorCb) {
          try {
            window.recaptchaVerifier = new RecaptchaVerifier(authInErrorCb, nodeInErrorCb, { size: 'invisible' });
          } catch (e) {
            console.error("Error re-initializing RecaptchaVerifier in sendOtp error handling:", e);
            // setError is already set from the primary error, avoid overwriting with a less specific one.
          }
        } else {
           // If auth became unavailable, update the error message
           setError("Authentication service issue during OTP sending. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (!window.confirmationResult) {
        throw new Error('ConfirmationResult not available. Please send OTP first.');
      }
      await window.confirmationResult.confirm(otp);
      toast({
        title: 'OTP Verified!',
        description: 'Authentication successful.',
        variant: 'default',
      });
      onOtpVerified(); // Call the success callback
      handleClose(); // Close dialog on success
    } catch (err) {
      console.error('Error verifying OTP:', err);
      const firebaseError = err as { code?: string; message?: string };
      setError(firebaseError.message || 'Failed to verify OTP. It might be incorrect or expired.');
      toast({
        title: 'OTP Verification Failed',
        description: firebaseError.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state on close
    setPhoneNumber('');
    setOtp('');
    setStep('phoneNumber');
    setError(null);
    setIsLoading(false);
    
    window.recaptchaVerifier?.clear();
    const nodeOnClose = recaptchaContainerRef.current;
    if(nodeOnClose) {
        nodeOnClose.innerHTML = ''; // Clear the div
    }
    // Delete global references to ensure clean state for next dialog opening
    if (typeof window !== 'undefined') {
        delete (window as any).recaptchaVerifier;
        delete (window as any).confirmationResult;
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Secure Action: Toggle Status
          </DialogTitle>
          <DialogDescription>
            For security, please verify your identity via OTP to change status for {gateName || "the gate"}.
          </DialogDescription>
        </DialogHeader>
        <div id="recaptcha-container-wrapper" className="my-2">
            <div ref={recaptchaContainerRef}></div> {/* This is where reCAPTCHA will render */}
        </div>

        {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{error}</p>}

        {step === 'phoneNumber' && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="phone-number" className="flex items-center">
                <Smartphone className="mr-2 h-4 w-4" />
                Phone Number (with country code)
              </Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleSendOtp} disabled={isLoading || !phoneNumber} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Send OTP
            </Button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleVerifyOtp} disabled={isLoading || otp.length !== 6} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Verify OTP
            </Button>
            <Button variant="link" onClick={() => { setStep('phoneNumber'); setError(null); setOtp(''); }} disabled={isLoading}>
              Change phone number?
            </Button>
          </div>
        )}
        <DialogFooter>
           <p className="text-xs text-muted-foreground text-center w-full">
            Make sure your Firebase project is set up for Phone Authentication and reCAPTCHA.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
