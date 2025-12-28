import { Link } from 'react-router-dom';
import { Flame, Wind, Zap, Users, Factory, Package, ArrowRight, Check, TrendingDown, IndianRupee, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-agriculture.jpg';

const Index = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Users,
      titleKey: 'solution.step1.title',
      descKey: 'solution.step1.desc',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Package,
      titleKey: 'solution.step2.title',
      descKey: 'solution.step2.desc',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: Factory,
      titleKey: 'solution.step3.title',
      descKey: 'solution.step3.desc',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Check,
      titleKey: 'solution.step4.title',
      descKey: 'solution.step4.desc',
      color: 'bg-accent/10 text-accent',
    },
  ];

  return (
    <div className="min-h-screen">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Golden wheat fields at sunset with wind turbines"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm text-primary-foreground mb-6 animate-fade-in">
              <Leaf className="w-4 h-4" />
              <span className="text-medium font-medium">A Digital Marketplace for Agricultural Biomass</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('hero.title')}
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/login?role=farmer">
                <Button size="xl" variant="accent" className="w-full sm:w-auto">
                  {t('hero.farmerCta')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login?role=buyer">
                <Button size="xl" variant="hero-outline" className="w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  {t('hero.buyerCta')}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full animate-pulse-soft" />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-4">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">The Crisis</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('problem.title')}</h2>
            <p className="text-lg text-muted-foreground">{t('problem.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="group hover:border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>{t('problem.card1.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('problem.card1.desc')}</p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Wind className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle>{t('problem.card2.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('problem.card2.desc')}</p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>{t('problem.card3.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('problem.card3.desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Our Solution</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('solution.title')}</h2>
            <p className="text-lg text-muted-foreground">{t('solution.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <div className="absolute top-8 left-[calc(50%+2rem)] right-0 h-0.5 bg-gradient-to-r from-primary/30 to-transparent hidden lg:block" style={{ display: index === 3 ? 'none' : undefined }} />
                  <span className="text-sm font-semibold text-primary mb-2">Step {index + 1}</span>
                  <h3 className="text-lg font-semibold mb-2">{t(step.titleKey)}</h3>
                  <p className="text-muted-foreground text-sm">{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Uses Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('users.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center gradient-primary-soft border-0">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{t('users.farmers.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('users.farmers.desc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center gradient-accent-soft border-0">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl gradient-accent mx-auto flex items-center justify-center mb-4 shadow-accent">
                  <Factory className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">{t('users.bioenergy.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('users.bioenergy.desc')}</p>
              </CardContent>
            </Card>

            <Card className="text-center gradient-primary-soft border-0">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-4 shadow-lg">
                  <Package className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{t('users.pellet.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('users.pellet.desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 md:py-28 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('impact.title')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
              <div className="w-14 h-14 rounded-xl bg-primary/20 mx-auto flex items-center justify-center mb-4">
                <TrendingDown className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground/80 mb-2">{t('impact.pollution.title')}</h3>
              <p className="text-4xl font-bold text-gradient-primary mb-2">{t('impact.pollution.value')}</p>
              <p className="text-primary-foreground/60">{t('impact.pollution.desc')}</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
              <div className="w-14 h-14 rounded-xl bg-accent/20 mx-auto flex items-center justify-center mb-4">
                <IndianRupee className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground/80 mb-2">{t('impact.farmers.title')}</h3>
              <p className="text-4xl font-bold text-gradient-accent mb-2">{t('impact.farmers.value')}</p>
              <p className="text-primary-foreground/60">{t('impact.farmers.desc')}</p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
              <div className="w-14 h-14 rounded-xl bg-primary/20 mx-auto flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-primary-foreground/80 mb-2">{t('impact.energy.title')}</h3>
              <p className="text-4xl font-bold text-gradient-primary mb-2">{t('impact.energy.value')}</p>
              <p className="text-primary-foreground/60">{t('impact.energy.desc')}</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/register">
              <Button size="xl" variant="accent">
                Join the Movement
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
