import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/config/supabaseClient";
import { Loader2, Shield, KeyRound, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ManageMFA: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    setLoading(true);
    try {
      const { data, error } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (error) throw error;
      setMfaEnabled(data.currentLevel === "aal2");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error checking MFA status",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const disableMFA = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.mfa.disable();
      if (error) throw error;
      setMfaEnabled(false);
      toast({
        title: "MFA Disabled",
        description: "Multi-factor authentication has been disabled.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error disabling MFA",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetupMFA = () => {
    navigate("/mfa/totp-setup");
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
        Back to Profile
      </Button>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-purple-600" />
            <CardTitle>Manage Multi-Factor Authentication</CardTitle>
          </div>
          <CardDescription>
            Manage your account's multi-factor authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-start space-x-3">
              <KeyRound className="w-5 h-5 mt-1 text-gray-500" />
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  {mfaEnabled
                    ? "Two-factor authentication is enabled"
                    : "Add an extra layer of security to your account"}
                </p>
              </div>
            </div>
            <Button
              variant={mfaEnabled ? "destructive" : "default"}
              onClick={mfaEnabled ? disableMFA : handleSetupMFA}
              className="shrink-0"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : mfaEnabled
                  ? "Disable 2FA"
                  : "Setup 2FA"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageMFA;
