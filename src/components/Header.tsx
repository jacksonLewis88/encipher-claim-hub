import { Shield, Lock, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const Header = () => {
  const { isConnected } = useAccount();

  return (
    <header className="border-b bg-gradient-subtle shadow-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" />
                <Lock className="h-4 w-4 text-accent absolute -bottom-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Encipher Claim Hub</h1>
                <p className="text-sm text-muted-foreground">Secure FHE-Encrypted Insurance Claims Portal</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success' : 'bg-warning'} animate-pulse`}></div>
              <span>{isConnected ? 'Wallet Connected' : 'Wallet Disconnected'}</span>
            </div>
            <Button variant="outline" size="sm">
              <FileCheck className="h-4 w-4 mr-2" />
              Help
            </Button>
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;