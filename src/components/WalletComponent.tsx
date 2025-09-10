import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpRight, ArrowDownLeft, Eye, EyeOff, Shield, Copy, ExternalLink } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';
import { useEncipherContract } from '@/hooks/useContract';
import { toast } from 'sonner';

const WalletComponent = () => {
  const [showBalance, setShowBalance] = useState(true);
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const { getUserClaims } = useEncipherContract();

  const { data: userClaims } = getUserClaims();

  const transactions = [
    { id: 1, type: "claim", amount: "2,450.00", date: "Today", status: "processed", encrypted: true },
    { id: 2, type: "premium", amount: "-850.00", date: "2 days ago", status: "completed", encrypted: true },
    { id: 3, type: "claim", amount: "1,200.00", date: "1 week ago", status: "processed", encrypted: true },
  ];

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const formatBalance = (balance: string | undefined) => {
    if (!balance) return "0.00";
    return parseFloat(balance).toFixed(4);
  };

  if (!isConnected) {
    return (
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span>Connect Your Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Connect your wallet to access secure claim management
            </p>
            <ConnectButton />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span>Secure Wallet</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              title="Copy address"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-gradient-security text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Available Balance</span>
            <Shield className="h-4 w-4 opacity-90" />
          </div>
          <div className="text-2xl font-bold">
            {showBalance ? `${formatBalance(balance?.formatted)} ${balance?.symbol || 'ETH'}` : "•••••••"}
          </div>
          <div className="text-sm opacity-90 mt-1">
            Encrypted • Last updated: Just now
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Recent Transactions</h4>
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  tx.type === 'claim' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  {tx.type === 'claim' ? 
                    <ArrowDownLeft className="h-4 w-4" /> : 
                    <ArrowUpRight className="h-4 w-4" />
                  }
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {tx.type === 'claim' ? 'Claim Payment' : 'Premium Payment'}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center space-x-1">
                    <span>{tx.date}</span>
                    {tx.encrypted && (
                      <>
                        <span>•</span>
                        <Shield className="h-3 w-3" />
                        <span>Encrypted</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${
                  tx.type === 'claim' ? 'text-success' : 'text-foreground'
                }`}>
                  {showBalance ? `$${tx.amount}` : "•••••"}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {tx.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletComponent;