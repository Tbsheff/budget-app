import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { supabase } from "../config/supabaseClient";
import { Loader2, SmartphoneNfc, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const MFASetup: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [factors, setFactors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadFactors();
  }, [user, navigate]);

  const loadFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      setFactors([...(data.totp || []), ...(data.phone || [])]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error loading MFA factors",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const startTOTPSetup = () => {
    navigate("/mfa/totp-setup");
  };

  const startPhoneSetup = () => {
    navigate("/mfa/phone-setup");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Multi-Factor Authentication</h1>

      <div className="grid gap-6 mb-8">
        {factors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Active MFA Methods</CardTitle>
              <CardDescription>
                Your currently enabled authentication factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {factors.map((factor) => (
                  <div
                    key={factor.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {factor.factor_type === "totp" ? (
                        <KeyRound className="w-5 h-5 text-green-600" />
                      ) : (
                        <SmartphoneNfc className="w-5 h-5 text-blue-600" />
                      )}
                      <div>
                        <p className="font-medium">
                          {factor.friendly_name ||
                            factor.factor_type.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {factor.factor_type === "totp"
                            ? "Authenticator App"
                            : factor.phone}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          await supabase.auth.mfa.unenroll({
                            factorId: factor.id,
                          });
                          toast({
                            title: "MFA factor removed",
                            description:
                              "The authentication method has been removed successfully.",
                          });
                          loadFactors();
                        } catch (error) {
                          toast({
                            variant: "destructive",
                            title: "Error removing factor",
                            description: error.message,
                          });
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Add New Authentication Method</CardTitle>
            <CardDescription>
              Choose an additional authentication method to secure your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button
              className="w-full justify-start gap-3"
              variant="outline"
              onClick={startTOTPSetup}
            >
              <KeyRound className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Authenticator App</div>
                <div className="text-sm text-gray-500">
                  Use Google Authenticator or similar apps
                </div>
              </div>
            </Button>

            <Button
              className="w-full justify-start gap-3"
              variant="outline"
              onClick={startPhoneSetup}
            >
              <SmartphoneNfc className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Phone Number</div>
                <div className="text-sm text-gray-500">
                  Receive codes via SMS
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MFASetup;
