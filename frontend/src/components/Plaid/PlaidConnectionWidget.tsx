import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Landmark, Check, RefreshCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import plaidService from '@/services/plaidService';
import PlaidLinkButton from './PlaidLinkButton';

export function PlaidConnectionWidget() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['plaidAccounts'],
    queryFn: plaidService.getLinkedAccounts,
    refetchOnWindowFocus: false,
  });

  const hasConnectedAccounts = accounts && accounts.length > 0;

  if (hasConnectedAccounts && !expanded) {
    return (
      <Card className="hover:border-primary/50 cursor-pointer transition-all" 
           onClick={() => setExpanded(true)}>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>Bank Accounts</span>
            <span className="text-sm font-normal bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md flex items-center">
              <Check className="w-4 h-4 mr-1" /> Connected
            </span>
          </CardTitle>
          <CardDescription>
            {accounts.reduce((total, item) => total + item.accounts.length, 0)} accounts linked
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={(e) => {
            e.stopPropagation();
            navigate('/bank-connections');
          }}>
            Manage <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={expanded ? 'border-primary/50' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Landmark className="mr-2 h-5 w-5" /> 
          Connect Bank Accounts
        </CardTitle>
        <CardDescription>
          Automatically import transactions to track your spending with ease
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : hasConnectedAccounts ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You have {accounts.reduce((total, item) => total + item.accounts.length, 0)} accounts connected from {accounts.length} {accounts.length === 1 ? 'institution' : 'institutions'}.
            </p>
            
            <div className="flex space-x-3">
              <Button className="flex-1" onClick={() => navigate('/bank-connections')}>
                Manage Connected Accounts
              </Button>
              <Button variant="outline" onClick={() => setExpanded(false)}>
                Collapse
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm">
              Benefits of connecting your accounts:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                <span>Auto-import transactions to save time</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                <span>Keep track of all your spending in one place</span>
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 mr-2 text-primary mt-0.5" />
                <span>Get a more complete picture of your finances</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {hasConnectedAccounts ? (
          <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')}>
            View Transactions <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={() => navigate('/bank-connections')}>
              Learn More
            </Button>
            <PlaidLinkButton
              buttonText="Connect Bank"
              onSuccess={() => navigate('/bank-connections')}
            />
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default PlaidConnectionWidget;