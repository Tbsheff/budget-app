import { useState, useEffect, useCallback } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Loader2, RefreshCw, Trash2, Search, Filter, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PlaidLinkButton from './PlaidLinkButton';
import plaidService, { PlaidItem } from '@/services/plaidService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function LinkedAccountsList() {
  const [accounts, setAccounts] = useState<PlaidItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncingIds, setSyncingIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedAccounts = await plaidService.getLinkedAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch linked accounts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleSyncTransactions = async (itemId: number) => {
    try {
      setSyncingIds(prev => [...prev, itemId]);
      await plaidService.syncTransactions(itemId);
      
      toast({
        title: 'Success',
        description: 'Transactions synced successfully.',
      });
    } catch (error) {
      console.error('Error syncing transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to sync transactions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSyncingIds(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleUnlinkAccount = async (itemId: number) => {
    try {
      setLoading(true);
      await plaidService.unlinkAccount(itemId);
      
      // Remove from local state
      setAccounts(prev => prev.filter(account => account.id !== itemId));
      
      toast({
        title: 'Success',
        description: 'Account unlinked successfully.',
      });
    } catch (error) {
      console.error('Error unlinking account:', error);
      toast({
        title: 'Error',
        description: 'Failed to unlink account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidSuccess = () => {
    fetchAccounts();
  };

  // Extract unique account types and institutions for filters
  const accountTypes = [...new Set(
    accounts.flatMap(item => item.accounts.map(account => account.type))
  )].filter(Boolean);
  
  const institutions = [...new Set(
    accounts.map(item => item.institution_name)
  )].filter(Boolean);

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter(item => {
    // Check if any account in this item matches the selected type filter
    const matchesType = selectedType ? item.accounts.some(acct => acct.type === selectedType) : true;
    
    // Check if institution matches
    const matchesInstitution = selectedInstitution ? item.institution_name === selectedInstitution : true;
    
    // Check if item name or any account name matches search term
    const matchesSearch = searchTerm ? 
      (item.institution_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item.accounts.some(acct => acct.name.toLowerCase().includes(searchTerm.toLowerCase()))) : 
      true;
    
    return matchesType && matchesInstitution && matchesSearch;
  }).map(item => {
    // If there's a type filter, filter the accounts within the item
    if (selectedType) {
      return {
        ...item,
        accounts: item.accounts.filter(acct => acct.type === selectedType)
      };
    }
    return item;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setSelectedInstitution('');
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Linked Accounts</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchAccounts}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <PlaidLinkButton onSuccess={handlePlaidSuccess} />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search accounts..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full" 
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="flex gap-2 items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {(selectedType || selectedInstitution) && (
            <Badge variant="secondary" className="ml-1">
              {(selectedType ? 1 : 0) + (selectedInstitution ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 p-4 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">Account Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="All account types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All account types</SelectItem>
                {accountTypes.map(type => (
                  <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Institution</label>
            <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
              <SelectTrigger>
                <SelectValue placeholder="All institutions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All institutions</SelectItem>
                {institutions.map(institution => (
                  <SelectItem key={institution} value={institution}>{institution}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(selectedType || selectedInstitution) && (
            <Button 
              variant="ghost" 
              className="sm:col-span-2" 
              onClick={clearFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          )}
        </div>
      )}

      {loading && accounts.length === 0 ? (
        <div className="flex justify-center p-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredAccounts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10 text-center">
            {accounts.length === 0 ? (
              <>
                <p className="text-muted-foreground mb-4">No bank accounts connected yet.</p>
                <PlaidLinkButton onSuccess={handlePlaidSuccess} />
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">No accounts match your search or filters.</p>
                <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAccounts.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.institution_name || 'Bank Account'}</CardTitle>
                <CardDescription>
                  {item.accounts.length} linked {item.accounts.length === 1 ? 'account' : 'accounts'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {item.accounts.map((account) => (
                    <li key={account.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{account.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">••••{account.mask}</span>
                      </div>
                      <span className="text-sm capitalize">{account.subtype || account.type}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="secondary" 
                  onClick={() => handleSyncTransactions(item.id)}
                  disabled={syncingIds.includes(item.id)}
                >
                  {syncingIds.includes(item.id) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Transactions
                    </>
                  )}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Unlink Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to unlink this account? This will remove all 
                        access to your financial data from this institution, but won't delete
                        any transactions that have already been imported.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleUnlinkAccount(item.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Unlink Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default LinkedAccountsList;