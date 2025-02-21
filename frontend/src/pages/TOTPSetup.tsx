import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { Loader2, KeyRound, ArrowLeft, QrCode, Shield } from "lucide-react";
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

const TOTPSetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [factorId, setFactorId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    setupTOTP();
  }, []);

  const setupTOTP = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });
      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error setting up authenticator",
        description: error.message,
      });
      navigate("/profile");
    } finally {
      setLoading(false);
    }
  };

  const verifyTOTP = async () => {
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
      const challenge = await supabase.auth.mfa.challenge({
        factorId,
      });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.data.id,
        code: verifyCode,
      });
      if (verify.error) throw verify.error;

      toast({
        title: "MFA setup complete",
        description: "Your authenticator app has been successfully configured",
      });
      navigate("/profile");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/profile")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to MFA Setup
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-purple-600" />
            <CardTitle>Set Up Authenticator App</CardTitle>
          </div>
          <CardDescription>
            Enhance your account security by setting up two-factor
            authentication with an authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-purple-600" />
              Step 1: Scan QR Code
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Open your authenticator app (like Google Authenticator or Authy)
              and scan this QR code:
            </p>
            {qrCode && (
              <div className="flex justify-center bg-white p-4 rounded-lg">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-48 h-48 shadow-sm"
                />
              </div>
            )}
          </div>

          {secret && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-medium mb-2">Can't scan the QR code?</h3>
              <p className="text-sm text-gray-600 mb-2">
                Manually enter this secret key in your authenticator app:
              </p>
              <code className="block bg-white px-3 py-2 rounded text-center font-mono text-sm break-all">
                {secret}
              </code>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verify-code">Verification Code</Label>
              <Input
                id="verify-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.trim())}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-sm text-gray-500">
                Enter the 6-digit code shown in your authenticator app
              </p>
            </div>

            <Button
              className="w-full"
              onClick={verifyTOTP}
              disabled={verifying || !verifyCode}
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TOTPSetup;
