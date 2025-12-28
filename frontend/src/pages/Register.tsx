// frontend/src/pages/Register.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import authBackground from '@/assets/auth-background.jpg';
import api from '@/lib/api';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  
  // Farmer fields
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [village, setVillage] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  
  
  // Buyer fields
  const [companyName, setCompanyName] = useState('');
  const [plantLocation, setPlantLocation] = useState('');
  const [acceptedCrops, setAcceptedCrops] = useState<string[]>(['paddy', 'wheat']);
  
  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { t, language, setLanguage } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });

        try {
          // Call Backend to get the Village/Area name
          const response = await api.get(`/auth/reverse-geocode`, {
            params: { latitude, longitude }
          });

          if (response.data.success) {
            const detectedArea = response.data.areaName;
            
            // Auto-fill the correct field based on role
            if (role === 'farmer') {
              setVillage(detectedArea);
            } else {
              setPlantLocation(detectedArea);
            }
            
            setLocationDetected(true);
            toast.success(`Location detected: ${detectedArea}`);
          }
        } catch (error) {
          toast.error('Failed to resolve area name from coordinates.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        toast.error('Failed to detect location. Please enable location access.');
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const baseUserData = role === 'farmer' 
        ? {
            name: farmerName,
            phone: farmerPhone,
            village,
            email,
            password,
            role: 'farmer' as const,
          }
        : {
            name: companyName,
            companyName,
            plantLocation,
            email,
            password,
            role: 'buyer' as const,
          };

      // Add coordinates if location was detected
      const userData = coordinates 
        ? { ...baseUserData, latitude: coordinates.latitude, longitude: coordinates.longitude }
        : baseUserData;
      
      const success = await register(userData);
      if (success) {
        toast.success('Account created successfully!');
        navigate(role === 'farmer' ? '/farmer/dashboard' : '/buyer/dashboard');
      } else {
        toast.error('Registration failed. Please try again.');
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
              Be part of the solution. Register today and help transform agricultural waste into renewable energy.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
              <CardTitle className="text-2xl">{t('auth.register.title')}</CardTitle>
              <CardDescription>{t('auth.register.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
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

                {/* Farmer Fields */}
                {role === 'farmer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="farmerName">{t('auth.name')}</Label>
                      <Input
                        id="farmerName"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmerPhone">{t('auth.phone')}</Label>
                      <Input
                        id="farmerPhone"
                        type="tel"
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="village">{t('auth.village')}</Label>
                      <Input
                        id="village"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Village, District, State"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('auth.preferredLanguage')}</Label>
                      <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Buyer Fields */}
                {role === 'buyer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{t('auth.companyName')}</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your company name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plantLocation">{t('auth.plantLocation')}</Label>
                      <Input
                        id="plantLocation"
                        value={plantLocation}
                        onChange={(e) => setPlantLocation(e.target.value)}
                        placeholder="City, State"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('auth.acceptedCrops')}</Label>
                      <div className="flex gap-2">
                        {['paddy', 'wheat', 'sugarcane', 'corn'].map((crop) => (
                          <button
                            key={crop}
                            type="button"
                            onClick={() => {
                              if (acceptedCrops.includes(crop)) {
                                setAcceptedCrops(acceptedCrops.filter(c => c !== crop));
                              } else {
                                setAcceptedCrops([...acceptedCrops, crop]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              acceptedCrops.includes(crop)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                          >
                            {crop.charAt(0).toUpperCase() + crop.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Common Fields */}
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
                      minLength={6}
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

                {/* Location Detection */}
                <div className="space-y-2">
                  <Label>Location Detection</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation || locationDetected}
                  >
                    {isDetectingLocation ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Detecting...
                      </>
                    ) : locationDetected ? (
                      <>
                        ✓ Location Detected
                      </>
                    ) : (
                      'Detect My Location'
                    )}
                  </Button>
                  {locationDetected && (
                    <p className="text-xs text-muted-foreground text-center">
                      Coordinates: {coordinates?.latitude.toFixed(4)}, {coordinates?.longitude.toFixed(4)}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : t('auth.registerBtn')}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {t('auth.hasAccount')}{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    {t('nav.login')}
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
