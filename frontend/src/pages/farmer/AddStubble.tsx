import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wheat, Calendar, MapPin, Package, AlertCircle, ArrowRight, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FarmerNavbar } from '@/components/layout/FarmerNavbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import api from '@/lib/api';

export default function AddStubble() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [cropType, setCropType] = useState('paddy');
  const [landArea, setLandArea] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [pickupStart, setPickupStart] = useState('');
  const [pickupEnd, setPickupEnd] = useState('');
  
  // NEW: Coordinates State
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAlreadyInCluster, setIsAlreadyInCluster] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await api.get('/farmers/dashboard');
        if (response.data.hasCluster) {
          setIsAlreadyInCluster(true);
        }
      } catch (error) {
        console.error("Status check failed", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  // NEW: Function to manually trigger geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("Geolocation is not supported by your browser.");
    }

    toast.info("Fetching your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        toast.success("Location updated successfully!");
      },
      () => {
        toast.error("Location Access Denied. Please enter coordinates manually.");
      }
    );
  };

  const estimatedStubble = landArea ? (parseFloat(landArea) * 2.5).toFixed(1) : '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!latitude || !longitude) {
      return toast.error("Please provide coordinates (Detect or Enter manually)");
    }
    
    setIsLoading(true);

    try {
      const response = await api.post('/farmers/add-stubble', {
        cropType,
        landArea: parseFloat(landArea),
        harvestDate,
        pickupStart,
        pickupEnd,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });

      if (response.data.success) {
        toast.success('Successfully joined a local cluster!');
        navigate('/farmer/my-cluster');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to add stubble.';
      toast.error(msg);
      if (msg.includes('already')) setIsAlreadyInCluster(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAlreadyInCluster) {
    return (
      <div className="min-h-screen bg-background">
        <FarmerNavbar />
        <main className="pt-24 px-4">
          <Card className="max-w-md mx-auto border-accent/50 bg-accent/5">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Already in a Cluster</h2>
              <p className="text-muted-foreground mb-6">
                You have already declared your stubble and are part of an active cluster.
              </p>
              <Button asChild className="w-full">
                <Link to="/farmer/my-cluster">
                  Go to My Cluster <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <FarmerNavbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('farmer.addStubble.title')}</h1>
            <p className="text-muted-foreground">Declare crop residue and join an aggregation cluster</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-primary" /> Stubble Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Geolocation Section */}
                <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Navigation className="w-4 h-4" /> Location Verification
                    </Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleGetLocation}>
                      Auto-Detect
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Latitude</p>
                      <Input 
                        placeholder="e.g. 21.1458" 
                        value={latitude} 
                        onChange={(e) => setLatitude(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Longitude</p>
                      <Input 
                        placeholder="e.g. 79.0882" 
                        value={longitude} 
                        onChange={(e) => setLongitude(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    * For testing Nagpur enter: Lat 21.14, Long 79.08. For Pune enter: Lat 18.52, Long 73.85.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>{t('farmer.addStubble.cropType')}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCropType('paddy')}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        cropType === 'paddy' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <span>🌾</span> {t('farmer.addStubble.paddy')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCropType('wheat')}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        cropType === 'wheat' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <span>🌿</span> {t('farmer.addStubble.wheat')}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landArea">{t('farmer.addStubble.landArea')}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="landArea" type="number" value={landArea} onChange={(e) => setLandArea(e.target.value)} placeholder="Acres" className="pl-10" required />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">Estimated Stubble</p>
                    <p className="text-2xl font-bold text-primary">{estimatedStubble} tons</p>
                </div>

                <div className="space-y-2">
                  <Label>Harvest Date</Label>
                  <Input type="date" value={harvestDate} onChange={(e) => setHarvestDate(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <Label>From</Label>
                        <Input type="date" value={pickupStart} onChange={(e) => setPickupStart(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label>To</Label>
                        <Input type="date" value={pickupEnd} onChange={(e) => setPickupEnd(e.target.value)} required />
                    </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Joining Cluster...' : t('farmer.addStubble.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}