import { useEffect, useState } from 'react';
import { MapPin, Package, Calendar, Lock, Loader2, AlertCircle, Info, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BuyerNavbar } from '@/components/layout/BuyerNavbar';
import { toast } from 'sonner';
import ClusterMap from '@/components/ClusterMap';
import api from '@/lib/api';

// --- ADD THIS HELPER AT THE TOP ---
const formatDateRange = (window: { start: string; end: string }) => {
  if (!window || !window.start || !window.end) return 'TBD';
  const start = new Date(window.start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const end = new Date(window.end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${start} - ${end}`;
};

export default function AvailableClusters() {
  const [clusters, setClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lockLoading, setLockLoading] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);

  const fetchClusters = async () => {
    try {
      const response = await api.get('/buyers/available-clusters');
      setClusters(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch clusters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClusters(); }, []);

  const handleLock = async (id: string, clusterDisplayId: string) => {
    setLockLoading(id);
    try {
      const response = await api.post(`/buyers/lock-cluster/${id}`);
      if (response.data.success) {
        toast.success(`Batch ${clusterDisplayId} secured!`);
        setSelectedCluster(null);
        fetchClusters();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to lock batch");
    } finally {
      setLockLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BuyerNavbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Available Clusters</h1>
            <p className="text-muted-foreground">Ready-to-procure biomass regional hubs</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
          ) : clusters.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p>No clusters currently available.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clusters.map(cluster => (
                <Card 
                  key={cluster._id} 
                  className="cursor-pointer hover:shadow-xl transition-all border-t-4 border-t-primary overflow-hidden group"
                  onClick={() => setSelectedCluster(cluster)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{cluster.hubName}</CardTitle>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${cluster.status === 'READY' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                        {cluster.status}
                      </span>
                    </div>
                    <div className="space-y-2 mt-1">
                      <p className="flex items-center gap-1 text-sm text-muted-foreground font-medium">
                        <MapPin className="w-4 h-4 text-primary" /> {cluster.clusterId}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-xs text-muted-foreground">Total Quantity</p><p className="font-bold text-lg text-primary">{cluster.totalQuantity} Tons</p></div>
                      <div><p className="text-xs text-muted-foreground">Farmers</p><p className="font-bold text-lg">{cluster.farmers.length}</p></div>
                    </div>
                    <Button variant="secondary" className="w-full">
                      <Info className="w-4 h-4 mr-2" /> View Full Logistics Map
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={!!selectedCluster} onOpenChange={(open) => !open && setSelectedCluster(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCluster && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex justify-between items-center">
                  <span>{selectedCluster.hubName}</span>
                  <span className="text-sm font-normal text-muted-foreground">{selectedCluster.clusterId}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="grid lg:grid-cols-2 gap-6 mt-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <Package className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-xl font-bold">{selectedCluster.totalQuantity}t</p>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">Total</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-xl font-bold">{selectedCluster.farmers.length}</p>
                      <p className="text-[9px] uppercase font-bold text-muted-foreground">Farmers</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                      {/* UPDATED DATE DISPLAY */}
                      <p className="text-[16px] font-bold leading-tight">{formatDateRange(selectedCluster.pickupWindow)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold">Aggregation Footprint</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCluster.coveredAreas.map((area: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-primary/5 border border-primary/10 rounded text-xs text-primary">{area}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-1 text-lg">
                      <span className="font-bold">Total Value:</span>
                      <span className="font-black text-primary">₹{(selectedCluster.totalQuantity * 700).toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleLock(selectedCluster._id, selectedCluster.clusterId)} 
                    className="w-full h-14 text-lg font-bold"
                    disabled={lockLoading === selectedCluster._id}
                  >
                    {lockLoading === selectedCluster._id ? <Loader2 className="animate-spin mr-2" /> : <Lock className="mr-2" />}
                    Lock Batch
                  </Button>
                </div>

                <div className="h-[400px] w-full rounded-xl overflow-hidden border bg-muted/20">
                    <ClusterMap 
                      key={selectedCluster._id}
                      center={[selectedCluster.location.coordinates[1], selectedCluster.location.coordinates[0]]} 
                      farmers={selectedCluster.farmers}
                    />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}