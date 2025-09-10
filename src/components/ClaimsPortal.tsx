import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NewClaimDialog from "./NewClaimDialog";
import { useAccount } from 'wagmi';
import { useEncipherContract } from '@/hooks/useContract';
import { toast } from 'sonner';
import { 
  FileText, 
  Shield, 
  Search, 
  Plus, 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const ClaimsPortal = () => {
  const { address, isConnected } = useAccount();
  const { getUserClaims } = useEncipherContract();
  
  const { data: userClaimIds, isLoading: claimsLoading } = getUserClaims();
  
  // Mock data for demonstration - in real app, this would come from contract
  const claims = [
    {
      id: "CLM-2024-001",
      type: "Auto Insurance",
      amount: "$2,450.00",
      status: "approved",
      date: "2024-01-15",
      encrypted: true,
      description: "Vehicle collision damage"
    },
    {
      id: "CLM-2024-002", 
      type: "Health Insurance",
      amount: "$1,200.00",
      status: "processing",
      date: "2024-01-10",
      encrypted: true,
      description: "Medical treatment coverage"
    },
    {
      id: "CLM-2024-003",
      type: "Home Insurance", 
      amount: "$5,800.00",
      status: "pending",
      date: "2024-01-08",
      encrypted: true,
      description: "Water damage repair"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-warning text-warning-foreground';
      case 'pending': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-3 w-3" />;
      case 'processing': return <Clock className="h-3 w-3" />;
      case 'pending': return <Calendar className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Claims Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved Amount</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Encrypted Claims</p>
                <p className="text-2xl font-bold">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Management */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Claims Management</span>
            </CardTitle>
            <NewClaimDialog>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                New Claim
              </Button>
            </NewClaimDialog>
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Claims</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="search"
                  placeholder="Search by claim ID, type, or description..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {claims.map((claim) => (
              <div 
                key={claim.id}
                className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{claim.id}</h3>
                        {claim.encrypted && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Encrypted
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{claim.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-muted-foreground">{claim.type}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{claim.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="text-lg font-semibold">{claim.amount}</div>
                    <Badge className={`${getStatusColor(claim.status)} text-xs`}>
                      {getStatusIcon(claim.status)}
                      <span className="ml-1 capitalize">{claim.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimsPortal;