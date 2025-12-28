import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Package, TrendingUp, Calendar, ArrowRight, Loader2, ShoppingBag, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FarmerNavbar } from '@/components/layout/FarmerNavbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

export default function FarmerDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [marketDemands, setMarketDemands] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/farmers/dashboard');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchMarketDemands = async () => {
      try {
        const response = await api.get('/demands/public');
        if (response.data.success) {
          setMarketDemands(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch market demands", error);
      }
    };
    fetchMarketDemands();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const { hasCluster, clusterData, stats } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FORMING': return 'bg-accent/20 text-accent';
      case 'READY': return 'bg-primary/20 text-primary';
      case 'LOCKED': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <FarmerNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {t('farmer.welcome')}, {user?.name}! 👋
            </h1>
            <p className="text-muted-foreground">{t('farmer.dashboard.title')}</p>
          </div>

          {/* Real Stats from Backend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Package />} label="Tons Declared" value={`${stats.declaredTons}t`} color="bg-primary" />
            <StatCard icon={<TrendingUp />} label="Potential Earnings" value={`₹${stats.earnings}`} color="bg-accent" />
            <StatCard icon={<Users />} label="Members" value={hasCluster ? clusterData.farmers.length : 0} color="bg-primary" />
            <StatCard icon={<Calendar />} label="Pickup" value={hasCluster ? stats.daysToPickup : "N/A"} color="bg-accent" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left 2 columns: Existing Cluster Status & Actions */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('farmer.dashboard.clusterStatus')}</CardTitle>
                  <CardDescription>{hasCluster ? `ID: ${clusterData.clusterId}` : t('farmer.dashboard.noCluster')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {hasCluster ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Status</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(clusterData.status)}`}>{clusterData.status}</span>
                      </div>
                      
                      {/* Progress Bar with overflow handling */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">Cluster Progress</span>
                          <span className="text-xs font-semibold text-primary">
                            {clusterData.totalQuantity}/{clusterData.targetQuantity} tons
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${(clusterData.totalQuantity / clusterData.targetQuantity) * 100}%` 
                            }} 
                          />
                        </div>
                        {clusterData.totalQuantity > clusterData.targetQuantity && (
                          <p className="text-xs text-accent font-medium">
                            ✓ Target reached! ({clusterData.totalQuantity - clusterData.targetQuantity} tons extra)
                          </p>
                        )}
                      </div>

                      <Link to="/farmer/my-cluster" className="w-full">
                        <Button variant="outline" className="w-full mt-4">View Details <ArrowRight className="ml-2 w-4 h-4"/></Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">You haven't joined a cluster yet.</p>
                      <Button asChild><Link to="/farmer/add-stubble">Join a Cluster</Link></Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <ActionLink to="/farmer/add-stubble" title="Add Stubble" desc="Declare new waste" icon={<Plus/>} />
                  <ActionLink to="/farmer/my-cluster" title="My Cluster" desc="Check progress" icon={<Users/>} />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: NEW Market Demand Feed */}
            <div className="md:col-span-1">
              <Card className="h-full border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <ShoppingBag className="w-5 h-5" /> Market Demand
                  </CardTitle>
                  <CardDescription>Real-time buyer requirements in the region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketDemands.length > 0 ? marketDemands.slice(0, 5).map((demand, i) => (
                      <div key={i} className="p-3 bg-background rounded-lg border border-border shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-sm capitalize">{demand.cropType} Stubble</p>
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">NEEDED</span>
                        </div>
                        <p className="text-lg font-black text-primary">{demand.quantityRequired} Tons</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {demand.buyer?.companyName || 'Bio-Energy Plant'}
                        </p>
                      </div>
                    )) : (
                      <p className="text-xs text-muted-foreground text-center py-10 italic">Checking for new requirements...</p>
                    )}
                  </div>
                  
                  <div className="mt-6 p-3 bg-primary text-primary-foreground rounded-lg text-xs text-center">
                    💡 Buyers pay more for larger clusters. Join yours today!
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

// Small helper components
function StatCard({ icon, label, value, color }: any) {
  return (
    <Card><CardContent className="pt-6 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg ${color}/10 flex items-center justify-center text-primary`}>{icon}</div>
      <div><p className="text-xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
    </CardContent></Card>
  )
}

function ActionLink({ to, title, desc, icon }: any) {
  return (
    <Link to={to} className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-all">
      <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center">{icon}</div>
      <div className="flex-1"><p className="font-medium">{title}</p><p className="text-xs text-muted-foreground">{desc}</p></div>
      <ArrowRight className="w-4 h-4" />
    </Link>
  )
}