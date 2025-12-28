import { Link } from 'react-router-dom';
import { Store, RefreshCw, Building2, ArrowRight, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FarmerNavbar } from '@/components/layout/FarmerNavbar';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Alternatives() {
  const { t } = useLanguage();

  const localBuyers = [
    {
      name: 'Haryana Bio-Fuel Co.',
      location: 'Karnal, 15 km away',
      phone: '+91 98765 12345',
      priceRange: '₹500-600/ton',
      minQuantity: '5 tons',
    },
    {
      name: 'Green Energy Solutions',
      location: 'Panipat, 25 km away',
      phone: '+91 98765 54321',
      priceRange: '₹450-550/ton',
      minQuantity: '10 tons',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <FarmerNavbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Clock className="w-4 h-4" />
              Cluster Expired
            </div>
            <h1 className="text-3xl font-bold mb-2">{t('farmer.alternatives.title')}</h1>
            <p className="text-muted-foreground">{t('farmer.alternatives.subtitle')}</p>
          </div>

          <div className="grid gap-6">
            {/* Local Buyers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  {t('farmer.alternatives.localBuyers')}
                </CardTitle>
                <CardDescription>
                  Small local buyers who can purchase smaller quantities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localBuyers.map((buyer, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="font-semibold">{buyer.name}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {buyer.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {buyer.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-primary font-medium">{buyer.priceRange}</span>
                            <span className="text-muted-foreground">Min: {buyer.minQuantity}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Contact
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Join Next Cycle */}
            <Card className="gradient-primary-soft border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  {t('farmer.alternatives.nextCycle')}
                </CardTitle>
                <CardDescription>
                  A new aggregation cycle starts every week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Join the next cluster formation cycle. New clusters typically fill up within 5-7 days.
                  You'll be notified when a new cluster matching your crop type is available.
                </p>
                <Link to="/farmer/add-stubble">
                  <Button>
                    Re-register for Next Cycle
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Government Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" />
                  {t('farmer.alternatives.govSupport')}
                </CardTitle>
                <CardDescription>
                  Government schemes and subsidies for stubble management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h4 className="font-medium mb-1">Crop Residue Management Scheme</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Get up to 50% subsidy on stubble management equipment
                    </p>
                    <a href="https://agricoop.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm text-primary font-medium hover:underline">
                      Learn more →
                    </a>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h4 className="font-medium mb-1">PM-KUSUM Scheme</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Solar power incentives for agricultural land
                    </p>
                    <a href="https://mnre.gov.in" target="_blank" rel="noopener noreferrer" className="text-sm text-primary font-medium hover:underline">
                      Learn more →
                    </a>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <h4 className="font-medium mb-1">District Agriculture Office</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Contact your local agriculture office for personalized guidance
                    </p>
                    <p className="text-sm text-primary font-medium">
                      Helpline: 1800-180-1551
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
