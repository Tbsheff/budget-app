import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/config/supabaseClient";
import { Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const TOTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode) {
      toast({
        variant: "destructive",
        title: "Verification code required",
        description: "Please enter the code from your authenticator app",
      });
      return;
    }

    setVerifying(true);
    try {
      const { data: factorData, error: factorError } =
        await supabase.auth.mfa.listFactors();

      if (factorError) throw factorError;

      const totpFactor = factorData.totp[0];

      if (!totpFactor) {
        throw new Error("TOTP factor not found");
      }

      const { data: challengeData, error: challengeError } =
        await supabase.auth.mfa.challenge({
          factorId: totpFactor.id,
        });

      if (challengeError) throw challengeError;

      const { data, error } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challengeData.id,
        code: verifyCode,
      });

      if (error) throw error;

      toast({
        title: "Verification successful",
        description: "You have been successfully logged in",
      });

      // Navigate to the intended destination or default route
      const intendedPath = "/dashboard";
      navigate(intendedPath);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: error.message,
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <KeyRound className="w-6 h-6 text-purple-600" />
            <CardTitle>Two-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Enter the 6-digit code from your authenticator app to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totp-code">Authentication Code</Label>
              <Input
                id="totp-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.trim())}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={verifying || !verifyCode}
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TOTPVerify;
