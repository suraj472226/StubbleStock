import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Layers, ClipboardList, TrendingUp, Package, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BuyerNavbar } from '@/components/layout/BuyerNavbar';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

export default function BuyerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [myDemands, setMyDemands] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/buyers/dashboard');
        setData(response.data.data);
      } catch (error) {
        console.error("Dashboard error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchMyDemands = async () => {
      try {
        const response = await api.get('/demands/my');
        if (response.data.success) {
          setMyDemands(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch demands", error);
      }
    };
    fetchMyDemands();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { stats, recentActivity } = data;

  return (
    <div className="min-h-screen bg-background">
      <BuyerNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.companyName || 'Buyer'}! 👋</h1>
            <p className="text-muted-foreground">Industrial Portal</p>
          </div>

          {/* Stats Cards - Dynamic Data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Layers />} label="Available Clusters" value={stats.availableClusters} color="text-primary" />
            <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center"><Package className="w-5 h-5 text-accent" /></div><div><p className="text-2xl font-bold">{stats.totalTonsAvailable}</p><p className="text-xs text-muted-foreground">Tons Available</p></div></div></CardContent></Card>
            <StatCard icon={<ClipboardList />} label="Active Orders" value={stats.activeOrders} color="text-primary" />
            <StatCard icon={<TrendingUp />} label="Completed Orders" value={stats.completedOrders} color="text-accent" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Link to="/buyer/create-demand" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-xl border hover:border-primary/30 hover:bg-primary/5 transition-all group">
                    <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center"><Plus className="w-6 h-6 text-primary-foreground" /></div>
                    <div className="flex-1"><p className="font-medium">Create New Demand</p><p className="text-sm text-muted-foreground">Specify biomass requirements</p></div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                </Link>
                <Link to="/buyer/available-clusters" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-xl border hover:border-accent/30 hover:bg-accent/5 transition-all group">
                    <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center"><Layers className="w-6 h-6 text-accent-foreground" /></div>
                    <div className="flex-1"><p className="font-medium">Browse Clusters</p><p className="text-sm text-muted-foreground">View and lock clusters</p></div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? recentActivity.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.time))} ago</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Active Requirements Section */}
          <div className="mt-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Your Active Requirements
                </CardTitle>
                <CardDescription>Track your posted biomass demands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myDemands.length > 0 ? myDemands.map((d, i) => (
                    <div key={i} className="flex justify-between items-center p-4 border rounded-lg bg-background hover:border-primary/30 transition-colors">
                      <div>
                        <p className="font-bold capitalize text-sm">{d.cropType} Stubble</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {d.quantityRequired} Tons Requested • Posted {formatDistanceToNow(new Date(d.createdAt))} ago
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${
                        d.status === 'OPEN' 
                          ? 'text-green-700 bg-green-100 border border-green-200' 
                          : 'text-gray-700 bg-gray-100 border border-gray-200'
                      }`}>
                        {d.status}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground italic mb-4">No demands posted yet.</p>
                      <Link to="/buyer/create-demand">
                        <Button size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Demand
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper component for clean look
function StatCard({ icon, label, value, color }: any) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${color}`}>{icon}</div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}