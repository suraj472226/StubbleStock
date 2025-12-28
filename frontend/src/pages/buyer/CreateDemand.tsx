import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardPlus, ArrowRight, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BuyerNavbar } from '@/components/layout/BuyerNavbar';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function CreateDemand() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cropType, setCropType] = useState('paddy');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/demands', {
        cropType,
        quantityRequired: parseFloat(quantity),
      });

      if (response.data.success) {
        toast.success("Demand Posted Successfully", {
          description: "Farmers and Aggregators can now see your requirement."
        });
        navigate('/buyer/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post demand");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BuyerNavbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Post New Requirement</h1>
            <p className="text-muted-foreground">Let the marketplace know what you need</p>
          </div>

          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardPlus className="w-5 h-5 text-primary" /> Demand Details
              </CardTitle>
              <CardDescription>Specify the biomass type and quantity required</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label>Residue Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {['paddy', 'wheat'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setCropType(type)}
                        className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                          cropType === type ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        <span className="text-2xl">{type === 'paddy' ? '🌾' : '🌿'}</span>
                        <span className="font-bold capitalize">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity Required (Tons)</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="e.g. 500" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required 
                  />
                  <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                    <Info className="w-3 h-3" /> Minimum 10 tons recommended for industrial pickup.
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                   <p className="text-xs font-bold uppercase text-muted-foreground">How it Works</p>
                   <p className="text-sm">Your demand will help farmers and aggregators align cluster formation
    to meet your required quantity in this region.</p>
                </div>

                <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Publish Demand"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}