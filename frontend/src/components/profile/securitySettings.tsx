import { useState, useEffect } from "react";
import { Shield, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/config/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export const SecuritySettings = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const { toast } = useToast();

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

  const handleSetupMFA = () => {
    if (mfaEnabled) {
      navigate("/mfa/manage");
    } else {
      navigate("/mfa/totp-setup");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-gray-500" />
          <CardTitle className="text-xl">Security Settings</CardTitle>
        </div>
        <CardDescription>
          Manage your account security and two-factor authentication settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            variant={mfaEnabled ? "secondary" : "default"}
            onClick={handleSetupMFA}
            className="shrink-0"
            disabled={loading}
          >
            {loading ? "Loading..." : mfaEnabled ? "Manage 2FA" : "Setup 2FA"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
