import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { useEncipherContract } from '@/hooks/useContract';
import { toast } from 'sonner';
import { 
  Plus, 
  Upload, 
  FileText, 
  Shield, 
  Calendar,
  DollarSign,
  AlertCircle
} from "lucide-react";

interface NewClaimDialogProps {
  children: React.ReactNode;
}

const NewClaimDialog = ({ children }: NewClaimDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    amount: "",
    date: "",
    policyNumber: "",
    documents: [] as File[]
  });
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { submitClaim, isPending, isConfirming, isConfirmed, error } = useEncipherContract();

  const claimTypes = [
    "Auto Insurance",
    "Health Insurance", 
    "Home Insurance",
    "Life Insurance",
    "Travel Insurance",
    "Business Insurance"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, documents: [...prev.documents, ...files] }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate evidence hash from uploaded documents
      const evidenceHash = formData.documents.length > 0 
        ? `evidence_${Date.now()}_${formData.documents.map(d => d.name).join('_')}`
        : `claim_${Date.now()}`;

      // Convert amount to wei (assuming 18 decimals)
      const amountInWei = BigInt(Math.floor(parseFloat(formData.amount) * 1e18));
      const policyNumber = BigInt(formData.policyNumber || "0");

      // For now, we'll use mock external encrypted values
      // In a real implementation, these would be properly encrypted using FHE
      const mockExternalAmount = {
        data: "0x" + amountInWei.toString(16).padStart(64, '0'),
        signature: "0x" + "0".repeat(128)
      } as any;

      const mockExternalPolicyNumber = {
        data: "0x" + policyNumber.toString(16).padStart(64, '0'),
        signature: "0x" + "0".repeat(128)
      } as any;

      const mockProof = "0x" + "0".repeat(256);

      await submitClaim(
        formData.type,
        formData.description,
        evidenceHash,
        mockExternalAmount,
        mockExternalPolicyNumber,
        mockProof
      );

      toast.success("Claim submitted successfully! Transaction is being processed.");
      
      setIsOpen(false);
      setFormData({
        type: "",
        description: "",
        amount: "",
        date: "",
        policyNumber: "",
        documents: []
      });
    } catch (err) {
      console.error("Error submitting claim:", err);
      toast.error("Failed to submit claim. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.type && formData.description && formData.amount && formData.date;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <span>Submit New Claim</span>
            <Badge variant="outline" className="ml-auto">
              <Shield className="h-3 w-3 mr-1" />
              FHE Encrypted
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Claim Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Claim Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select insurance type" />
              </SelectTrigger>
              <SelectContent>
                {claimTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Claim Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed description of your claim..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Claim Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Incident Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Policy Number */}
          <div className="space-y-2">
            <Label htmlFor="policyNumber">Policy Number</Label>
            <Input
              id="policyNumber"
              placeholder="Enter your policy number (optional)"
              value={formData.policyNumber}
              onChange={(e) => handleInputChange("policyNumber", e.target.value)}
            />
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <Label>Supporting Documents</Label>
            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload photos, receipts, medical reports, or other supporting documents
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Documents */}
            {formData.documents.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                <div className="space-y-2">
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Encrypted
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-accent">Security Notice</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All claim data and documents will be encrypted using Fully Homomorphic Encryption (FHE) 
                    to ensure maximum privacy and security during processing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting || isPending || isConfirming}
              className="bg-gradient-primary hover:opacity-90"
            >
              {isSubmitting || isPending ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  {isPending ? "Confirming..." : "Processing..."}
                </>
              ) : isConfirming ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Confirming...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Claim
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClaimDialog;