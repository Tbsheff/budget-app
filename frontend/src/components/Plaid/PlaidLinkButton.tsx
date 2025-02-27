/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import plaidService from '@/services/plaidService';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PlaidLinkButtonProps {
  onSuccess?: (data: { accounts: any[]; item: any }) => void;
  onExit?: () => void;
  buttonText?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const PlaidLinkButton = ({
  onSuccess,
  onExit,
  buttonText = 'Connect Bank Account',
  className = '',
  variant = 'default'
}: PlaidLinkButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLinkToken = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await plaidService.createLinkToken();
      setToken(response.link_token);
    } catch (error) {
      console.error('Error fetching link token:', error);
      setError('Unable to connect to financial services. Please try again later.');
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to Plaid. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const onPlaidSuccess = useCallback(
    async (publicToken: string, metadata: any) => {
      try {
        setError(null);
        setLoading(true);
        const institution = {
          name: metadata.institution.name,
          institution_id: metadata.institution.institution_id,
        };
        
        const response = await plaidService.exchangePublicToken(publicToken, institution);
        
        toast({
          title: 'Success!',
          description: 'Your bank account was successfully connected.',
        });
        
        if (onSuccess) {
          onSuccess(response);
        }
      } catch (error) {
        console.error('Error linking account:', error);
        setError('Unable to link your bank account. This could be due to a connection issue or temporary service disruption.');
        toast({
          title: 'Connection Failed',
          description: 'Failed to link your bank account. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, toast]
  );

  const handlePlaidExit = useCallback(
    (err: any) => {
      // Only set an error message if the user didn't just close the window voluntarily
      if (err && err.error_code && err.error_code !== 'user_closed') {
        setError(`Connection issue: ${err.display_message || err.error_message || 'Unknown error'}`);
      }
      if (onExit) {
        onExit();
      }
    },
    [onExit]
  );

  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (public_token, metadata) => {
      onPlaidSuccess(public_token, metadata);
    },
    onExit: handlePlaidExit,
  });

  const handleClick = () => {
    if (token) {
      open();
    } else {
      fetchLinkToken();
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button
        onClick={handleClick}
        disabled={loading || (!!token && !ready)}
        className={className}
        variant={variant}
      >
        {loading ? 'Connecting...' : buttonText}
      </Button>
    </div>
  );
};

export default PlaidLinkButton;