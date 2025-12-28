import { useEffect, useState } from 'react';
import { Package, Leaf, MapPin, Loader2, CheckCircle2, Timer, Map as MapIcon, ArrowRight, CheckCircle, Calendar, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BuyerNavbar } from '@/components/layout/BuyerNavbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import ClusterMap from '@/components/ClusterMap';
import { Phone, User as UserIcon, Mail } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

// --- ADD THIS HELPER ---
const formatDateRange = (window: { start: string; end: string }) => {
  if (!window || !window.start || !window.end) return 'TBD';
  const start = new Date(window.start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const end = new Date(window.end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${start} - ${end}`;
};

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/buyers/my-orders');
      setOrders(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    let nextStatus = "";
    if (currentStatus === 'LOCKED') nextStatus = 'PROCESSING';
    else if (currentStatus === 'PROCESSING') nextStatus = 'COMPLETED';
    else return;

    setActionLoading(orderId);
    try {
      await api.patch(`/buyers/order/${orderId}/status`, { status: nextStatus });
      toast.success(`Order moved to ${nextStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <BuyerNavbar />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold">Procured Batches</h1>
              <p className="text-muted-foreground">Manage secured biomass supply</p>
            </div>
            <div className="hidden md:block text-right bg-primary/10 p-3 rounded-lg border border-primary/20">
              <p className="text-xs font-bold text-primary uppercase">Sustainability Impact</p>
              <p className="text-xl font-bold flex items-center justify-end gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                {orders.reduce((acc, o) => acc + (o.tonnage * 1.5), 0).toFixed(1)}t CO₂ Saved
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-black bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase">
                        {order.cluster?.clusterId}
                      </span>
                      <h3 className="text-xl font-bold">{order.cluster?.hubName}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">
                          {order.cluster?.coveredAreas?.join(', ')}
                        </span>
                      </div>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto text-primary text-xs font-bold"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <MapIcon className="w-3 h-3 mr-1" /> View Logistics Map
                      </Button>
                    </div>

                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Weight</p>
                        <p className="text-lg font-bold">{order.tonnage} Tons</p>
                        <p className="text-xs text-primary font-medium capitalize">{order.cluster?.cropType}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Status</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold block ${
                            order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                            {order.status}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium italic">
                            Pickup: {formatDateRange(order.cluster?.pickupWindow)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-2 min-w-[180px]">
                      {order.status !== 'COMPLETED' ? (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full text-xs font-bold"
                          onClick={() => handleUpdateStatus(order._id, order.status)}
                          disabled={actionLoading === order._id}
                        >
                          {actionLoading === order._id ? <Loader2 className="animate-spin w-4 h-4" /> : 
                           order.status === 'LOCKED' ? "Start Logistics" : "Confirm Delivery"}
                        </Button>
                      ) : (
                        <div className="text-right text-green-600 flex items-center justify-end gap-1 font-bold text-xs">
                          <CheckCircle className="w-4 h-4" /> Delivered
                        </div>
                      )}
                      
                      <div className="text-right">
                        <p className="text-lg font-black">₹{order.totalAmount?.toLocaleString()}</p>
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
{/* LOGISTICS MAP MODAL */}
<Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
  <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="flex justify-between items-center pr-6 border-b pb-4">
        <div className="flex flex-col">
           <span>Logistics Hub: {selectedOrder?.cluster?.hubName}</span>
           <span className="text-xs font-normal text-muted-foreground mt-1">
             Batch ID: {selectedOrder?.cluster?.clusterId} • {selectedOrder?.tonnage} Tons Total
           </span>
        </div>
      </DialogTitle>
    </DialogHeader>
    
    {selectedOrder && (
      <div className="grid lg:grid-cols-3 gap-6 mt-4">
        
        {/* Left: Map (Takes 2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[450px] w-full rounded-xl overflow-hidden border shadow-inner">
            <ClusterMap 
              center={[selectedOrder.cluster.location.coordinates[1], selectedOrder.cluster.location.coordinates[0]]}
              farmers={selectedOrder.cluster.farmers}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-muted/50 rounded border">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Region</p>
              <p className="text-xs font-bold truncate">{selectedOrder.cluster.hubName}</p>
            </div>
            <div className="p-2 bg-primary/5 rounded border border-primary/20">
              <p className="text-[10px] uppercase font-bold text-primary">Pickup Window</p>
              <p className="text-xs font-bold">{formatDateRange(selectedOrder.cluster.pickupWindow)}</p>
            </div>
            <div className="p-2 bg-muted/50 rounded border">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
              <p className="text-xs font-bold text-blue-600">{selectedOrder.status}</p>
            </div>
          </div>
        </div>

        {/* Right: Farmer Contact Directory */}
<div className="space-y-4 border-l pl-4">
  <h3 className="font-bold text-sm flex items-center gap-2 px-2">
    <Users className="w-4 h-4 text-primary" /> 
    Farmer Contact List
  </h3>
  
  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
    {selectedOrder.cluster.farmers.map((f: any, i: number) => (
      <Card key={i} className="shadow-none border-muted-foreground/10 bg-muted/20">
        <CardContent className="p-3 space-y-3">
          
          {/* Farmer Identity & Quantity */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                {f.user?.name ? f.user.name.charAt(0) : 'F'}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">{f.user?.name || 'Unknown Farmer'}</p>
                <p className="text-[10px] text-muted-foreground">{f.user?.village || 'Location N/A'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-primary">{f.totalStubble}t</p>
              <p className="text-[9px] text-muted-foreground uppercase">Supply</p>
            </div>
          </div>

          {/* Actual Contact Details - No fake links */}
          <div className="pt-2 border-t border-muted-foreground/10 space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-5 h-5 rounded bg-white flex items-center justify-center border">
                <Phone className="w-3 h-3 text-primary" />
              </div>
              <span className="font-medium">{f.user?.phone || 'No phone provided'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <div className="w-5 h-5 rounded bg-white flex items-center justify-center border">
                <Mail className="w-3 h-3 text-primary" />
              </div>
              <span className="font-medium truncate max-w-[180px]">
                {f.user?.email || 'No email provided'}
              </span>
            </div>
          </div>

        </CardContent>
      </Card>
    ))}
  </div>
  
  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-[10px] text-primary/80 leading-relaxed italic">
    <strong>Logistics Note:</strong> Please coordinate directly with farmers for exact gate-entry instructions.
  </div>
</div>

      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
  );
}