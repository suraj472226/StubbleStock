// frontend/src/pages/Login.tsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Leaf, User, Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import authBackground from '@/assets/image.png';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') as 'farmer' | 'buyer' | null;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'farmer' | 'buyer'>(initialRole || 'farmer');
  const [isLoading, setIsLoading] = useState(false);
  
  const { t, language, setLanguage } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, role);
      if (success) {
        toast.success('Login successful!');
        navigate(role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
      } else {
        toast.error('Invalid credentials.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={authBackground}
          alt="Agricultural field"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-primary opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground">
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm mx-auto flex items-center justify-center mb-6">
              <Leaf className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">StubbleStock</h2>
            <p className="text-lg text-primary-foreground/80 max-w-md">
              Join thousands of farmers and buyers working together to transform agricultural waste into clean energy.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Language Toggle */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center bg-secondary rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  language === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  language === 'hi'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">StubbleStock</span>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t('auth.login.title')}</CardTitle>
              <CardDescription>{t('auth.login.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>{t('auth.role')}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('farmer')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        role === 'farmer'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <User className={`w-6 h-6 mx-auto mb-2 ${role === 'farmer' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className={`text-sm font-medium ${role === 'farmer' ? 'text-primary' : 'text-muted-foreground'}`}>
                        {t('auth.farmer')}
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        role === 'buyer'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <Building2 className={`w-6 h-6 mx-auto mb-2 ${role === 'buyer' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className={`text-sm font-medium ${role === 'buyer' ? 'text-primary' : 'text-muted-foreground'}`}>
                        {t('auth.buyer')}
                      </p>
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : t('auth.loginBtn')}
                </Button>

                {/* Demo credentials hint */}
                <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  <p className="font-medium mb-1">Roles</p>
                  <p> Seller : Farmer or Farmer Producer Organisations </p>
                  <p> Buyer : Bio-Energy Plants or other Organizations</p>
                  <p></p>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  {t('auth.noAccount')}{' '}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    {t('nav.register')}
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
