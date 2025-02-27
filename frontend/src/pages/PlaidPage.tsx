import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LinkedAccountsList from '@/components/Plaid/LinkedAccountsList';
import PlaidLinkButton from '@/components/Plaid/PlaidLinkButton';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon, RefreshCcw } from 'lucide-react';

export function PlaidPage() {
  return (
    <>
      <Helmet>
        <title>Bank Connections - Budget App</title>
      </Helmet>

      <div className="flex min-h-screen flex-col">
        
        <div className="container flex-1 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Bank Connections</h1>
            <p className="text-muted-foreground">
              Connect your bank accounts to automatically import transactions and track your spending.
            </p>
          </div>

          <Tabs defaultValue="accounts">
            <TabsList className="mb-4">
              <TabsTrigger value="accounts">Linked Accounts</TabsTrigger>
              <TabsTrigger value="about">About Bank Connections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="accounts" className="space-y-4">
              <LinkedAccountsList />
            </TabsContent>
            
            <TabsContent value="about" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About Bank Connections</CardTitle>
                  <CardDescription>
                    How secure bank connections work in Budget App
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">Secure Connection</h3>
                      <p className="text-muted-foreground">
                        We use Plaid, a financial services platform, to securely connect to your bank accounts. 
                        Your bank credentials are never stored on our servers.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">Data Usage</h3>
                      <p className="text-muted-foreground">
                        When you connect your accounts, we only have access to transaction data and account balances.
                        We never sell your data to third parties.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">Auto-Categorization</h3>
                      <p className="text-muted-foreground">
                        Your imported transactions are automatically categorized to help you track your spending without manual entry.
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <PlaidLinkButton className="w-full" buttonText="Connect Your First Account" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Sync Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <RefreshCcw className="h-8 w-8 mr-3 text-primary" />
                      <div>
                        <p>Transactions are synced automatically once per day.</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You can also manually sync at any time.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Your privacy is important to us. We use industry-standard encryption and security practices.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Read more in our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-10">
            <Link to="/dashboard" className="flex items-center text-primary hover:underline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <Link to="/transactions" className="flex items-center text-primary hover:underline">
              View Transactions
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlaidPage;