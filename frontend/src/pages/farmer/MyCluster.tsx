import { useEffect, useState, useCallback } from 'react';
import { Users, Package, Calendar, MapPin, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FarmerNavbar } from '@/components/layout/FarmerNavbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, ThumbsUp, Send, CalendarDays } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatDateRange } from '@/lib/utils';

export default function MyCluster() {
  const { t } = useLanguage();
  const { user: authUser } = useAuth(); // To identify "Your Contribution"
  const [loading, setLoading] = useState(true);
  const [cluster, setCluster] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  
  // NEW: State for Date Range Proposal
  const [propStart, setPropStart] = useState("");
  const [propEnd, setPropEnd] = useState("");

  // Moved fetchClusterData here so it can be reused by handlers
  const fetchClusterData = useCallback(async () => {
    try {
      const response = await api.get('/farmers/my-cluster');
      if (response.data.success) {
        setCluster(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "No active cluster found.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClusterData();
  }, [fetchClusterData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FORMING': return 'bg-accent/20 text-accent border-accent/30';
      case 'READY': return 'bg-primary/20 text-primary border-primary/30';
      case 'LOCKED': return 'bg-primary text-primary-foreground border-primary';
      case 'EXPIRED': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'FORMING': return t('farmer.myCluster.forming');
      case 'READY': return t('farmer.myCluster.ready');
      case 'LOCKED': return t('farmer.myCluster.locked');
      case 'EXPIRED': return t('farmer.myCluster.expired');
      default: return status;
    }
  };

  const handleSendMessage = async () => {
    if (!msg.trim()) return;
    try {
      await api.post(`/farmers/cluster/${cluster._id}/message`, { text: msg });
      setMsg("");
      fetchClusterData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async () => {
    try {
      await api.post(`/farmers/cluster/${cluster._id}/approve-date`);
      toast.success("You approved the new schedule!");
      fetchClusterData();
    } catch (err) {
      toast.error("Error submitting approval");
    }
  };

  const handleProposeNewWindow = async () => {
    if (!propStart || !propEnd) {
      return toast.error("Please select both start and end dates.");
    }
    
    // Format: "2025-01-20 to 2025-01-25"
    const formattedWindow = `${propStart} to ${propEnd}`;

    try {
      await api.post(`/farmers/cluster/${cluster._id}/propose-date`, { 
        newWindow: formattedWindow 
      });
      toast.success("New pickup window proposed!");
      setPropStart("");
      setPropEnd("");
      fetchClusterData(); // Refresh UI
    } catch (err) {
      toast.error("Failed to propose dates.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !cluster) {
    return (
      <div className="min-h-screen bg-background">
        <FarmerNavbar />
        <main className="pt-24 px-4 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold">{error || "No active cluster"}</h2>
          <p className="text-muted-foreground">Join a cluster from the dashboard to see details.</p>
        </main>
      </div>
    );
  }

  const progressPercent = (cluster.totalQuantity / cluster.targetQuantity) * 100;
  
  // Find current logged-in farmer's specific contribution from the cluster list
  const myContribution = cluster.farmers.find((f: any) => f.user._id === authUser?.id);

  return (
    <div className="min-h-screen bg-background">
      <FarmerNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('farmer.myCluster.title')}</h1>
            <p className="text-muted-foreground">View your cluster status and fellow farmers</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cluster Overview */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{t('farmer.myCluster.clusterId')}: {cluster.clusterId}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        {cluster.farmers[0]?.user.village || 'Region'}
                      </CardDescription>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(cluster.status)}`}>
                      {cluster.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress Section */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Cluster Formation Progress</span>
                      <span className="font-semibold">{cluster.totalQuantity}/{cluster.targetQuantity} tons</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-primary rounded-full transition-all duration-500 relative"
                        style={{ width: `${progressPercent}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-pulse-soft" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {Math.max(0, cluster.targetQuantity - cluster.totalQuantity)} more tons needed to reach target
                    </p>
                  </div>

                  {/* Status Message */}
                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 mb-6">
                    <p className="text-sm font-medium text-accent">{getStatusText(cluster.status)}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-primary">{cluster.farmers.length}</p>
                      <p className="text-xs text-muted-foreground">{t('farmer.myCluster.farmersCount')}</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-primary capitalize">{cluster.cropType}</p>
                      <p className="text-xs text-muted-foreground">{t('farmer.myCluster.cropType')}</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-primary">{cluster.totalQuantity}</p>
                      <p className="text-xs text-muted-foreground">Tons Collected</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-muted/50">
                      <p className="text-2xl font-bold text-accent">₹700</p>
                      <p className="text-xs text-muted-foreground">Est. Price/Ton</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farmers List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Cluster Members
                  </CardTitle>
                  <CardDescription>{cluster.farmers.length} farmers have joined this cluster</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cluster.farmers.map((farmerObj: any, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                            {farmerObj.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{farmerObj.user.name}</p>
                            <p className="text-xs text-muted-foreground">{farmerObj.user.village || 'Member'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary">{farmerObj.totalStubble} tons</p>
                          <p className="text-xs text-muted-foreground">Active Member</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* --- NEW COMMUNITY MESSAGE BOARD --- */}
              <Card>
                <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MessageSquare size={16}/> Cluster Discussion</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-48 overflow-y-auto mb-4 space-y-2 p-2 border rounded bg-muted/20">
                    {cluster.messages && cluster.messages.length > 0 ? cluster.messages.map((m: any, i: number) => (
                      <div key={i} className="text-sm">
                        <span className="font-bold text-primary">{m.senderName}: </span>
                        <span className="text-muted-foreground">{m.text}</span>
                      </div>
                    )) : <p className="text-xs text-muted-foreground text-center py-4">No messages yet. Start the discussion!</p>}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Share thoughts with fellow farmers..." value={msg} onChange={e => setMsg(e.target.value)} />
                    <Button onClick={handleSendMessage} size="icon"><Send size={16}/></Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* --- NEW DATE COORDINATION CARD --- */}
              <Card className="border-accent/30 bg-accent/5">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2 text-accent">
                    <CalendarDays size={16}/> Schedule Coordination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cluster.proposedWindow ? (
                    <div className="p-3 bg-background rounded-lg border-2 border-primary/20">
                      <p className="text-[10px] font-bold text-primary uppercase">New Proposed Window:</p>
                      <p className="font-bold text-sm my-1">{cluster.proposedWindow}</p>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-[10px]">
                          <span>Community Approval</span>
                          <span className="font-bold">{cluster.approvals?.length || 0} / {cluster.farmers.length}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-primary transition-all duration-500" 
                             style={{width: `${((cluster.approvals?.length || 0) / cluster.farmers.length) * 100}%`}} 
                          />
                        </div>
                        <Button onClick={handleApprove} variant="default" size="sm" className="w-full text-xs h-8">
                          <ThumbsUp size={12} className="mr-2"/> I agree to this window
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase">Propose New Window</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-[10px]">From</Label>
                            <Input type="date" value={propStart} onChange={e => setPropStart(e.target.value)} className="h-8 text-xs" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px]">To</Label>
                            <Input type="date" value={propEnd} onChange={e => setPropEnd(e.target.value)} className="h-8 text-xs" />
                        </div>
                      </div>
                      <Button 
                        onClick={handleProposeNewWindow} 
                        variant="outline"
                        size="sm"
                        className="w-full text-xs h-8 transition-all duration-300 hover:scale-[1.03]"
                        disabled={!propStart || !propEnd}

                      >
                        Request Change
                      </Button>
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground leading-tight italic">
                    * All members must approve for the window to change. This ensures no farmer is left behind during collection.
                  </p>
                </CardContent>
              </Card>

              {/* Pickup Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-accent" />
                    {t('farmer.addStubble.pickupWindow')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold">{formatDateRange(cluster.pickupWindow)}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Collection team will visit your location during this window
                  </p>
                </CardContent>
              </Card>

              {/* Your Contribution */}
              <Card className="gradient-primary-soft border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-primary" />
                    Your Contribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity</span>
                    <span className="font-semibold">{myContribution?.totalStubble || 0} tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Crop Type</span>
                    <span className="font-semibold capitalize">{cluster.cropType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Earnings</span>
                    <span className="font-semibold text-accent">₹{(myContribution?.totalStubble * 700).toLocaleString() || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                      <p className="text-sm">Cluster reaches 100 tons target</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted mt-0.5" />
                      <p className="text-sm text-muted-foreground">Buyer locks the batch</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted mt-0.5" />
                      <p className="text-sm text-muted-foreground">Collection team visits</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-muted mt-0.5" />
                      <p className="text-sm text-muted-foreground">Payment received</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
