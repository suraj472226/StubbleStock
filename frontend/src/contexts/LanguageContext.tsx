import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.howItWorks': 'How It Works',
    'nav.impact': 'Impact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.addStubble': 'Add Stubble',
    'nav.myCluster': 'My Cluster',
    'nav.alternatives': 'Alternatives',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Landing Page
    'hero.title': 'Turning Crop Waste into Clean Energy',
    'hero.subtitle': 'StubbleStock connects farmers with bio-energy plants, transforming agricultural residue into renewable fuel while preventing harmful stubble burning.',
    'hero.farmerCta': 'Farmer Login',
    'hero.buyerCta': 'Buyer Login',
    
    'problem.title': 'The Stubble Burning Crisis',
    'problem.subtitle': 'Every year, millions of tons of crop residue are burned, causing severe air pollution and health hazards.',
    'problem.card1.title': 'Why Stubble Burning?',
    'problem.card1.desc': 'Farmers face short windows between harvest and next sowing. Burning is the quickest way to clear fields, but individual stubble quantities are too small for buyers to collect economically.',
    'problem.card2.title': 'Environmental Impact',
    'problem.card2.desc': 'Stubble burning releases harmful pollutants into the atmosphere, contributing to severe air quality issues in cities and respiratory health problems for millions.',
    'problem.card3.title': 'The Coordination Gap',
    'problem.card3.desc': 'Bio-energy plants need bulk quantities, but individual farmers have small amounts. Without aggregation, the economics don\'t work for anyone.',
    
    'solution.title': 'How StubbleStock Works',
    'solution.subtitle': 'We solve the coordination problem by aggregating stubble into economically viable clusters.',
    'solution.step1.title': 'Farmers Declare Stubble',
    'solution.step1.desc': 'Farmers register their crop residue details including type, quantity, and pickup availability.',
    'solution.step2.title': 'System Aggregates Clusters',
    'solution.step2.desc': 'Our platform groups nearby farmers into clusters that meet minimum viable quantities for buyers.',
    'solution.step3.title': 'Buyers Procure in Bulk',
    'solution.step3.desc': 'Bio-energy plants can now purchase aggregated clusters, making collection economically feasible.',
    'solution.step4.title': 'Stubble Collected, Not Burned',
    'solution.step4.desc': 'Professional collection teams pick up the stubble, and farmers earn income instead of burning.',
    
    'users.title': 'Who Uses StubbleStock',
    'users.farmers.title': 'Farmers & FPOs',
    'users.farmers.desc': 'Individual farmers and Farmer Producer Organizations can earn from their crop waste instead of burning it.',
    'users.bioenergy.title': 'Bio-Energy Plants',
    'users.bioenergy.desc': 'Power plants and biogas facilities get reliable supply of agricultural biomass at scale.',
    'users.pellet.title': 'Pellet Manufacturers',
    'users.pellet.desc': 'Bio-fuel and pellet producers can source raw material efficiently from aggregated clusters.',
    
    'impact.title': 'Achievable Impact',
    'impact.pollution.title': 'Pollution Reduction',
    'impact.pollution.value': '2.5M+ Tons',
    'impact.pollution.desc': 'of CO2 emissions can be prevented annually',
    'impact.farmers.title': 'Farmer Savings',
    'impact.farmers.value': '₹15,000+',
    'impact.farmers.desc': 'average additional income per farmer',
    'impact.energy.title': 'Clean Energy',
    'impact.energy.value': '500+ MW',
    'impact.energy.desc': 'of renewable energy can be enabled',
    
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.copyright': '© 2024 StubbleStock. All rights reserved.',
    
    // Farmer Pages
    'farmer.welcome': 'Welcome',
    'farmer.dashboard.title': 'Farmer Dashboard',
    'farmer.dashboard.clusterStatus': 'Current Cluster Status',
    'farmer.dashboard.noCluster': 'You haven\'t joined any cluster yet',
    'farmer.dashboard.joinCluster': 'Join a Cluster',
    'farmer.addStubble.title': 'Add Your Stubble',
    'farmer.addStubble.cropType': 'Crop Type',
    'farmer.addStubble.paddy': 'Paddy',
    'farmer.addStubble.wheat': 'Wheat',
    'farmer.addStubble.landArea': 'Land Area (Acres)',
    'farmer.addStubble.estimatedStubble': 'Estimated Stubble (Tons)',
    'farmer.addStubble.harvestDate': 'Harvest Date',
    'farmer.addStubble.pickupWindow': 'Pickup Window',
    'farmer.addStubble.submit': 'Join Cluster',
    'farmer.myCluster.title': 'My Cluster',
    'farmer.myCluster.clusterId': 'Cluster ID',
    'farmer.myCluster.cropType': 'Crop Type',
    'farmer.myCluster.totalQuantity': 'Total Quantity',
    'farmer.myCluster.farmersCount': 'Farmers in Cluster',
    'farmer.myCluster.status': 'Status',
    'farmer.myCluster.forming': 'Forming - Gathering more farmers',
    'farmer.myCluster.ready': 'Ready - Awaiting buyer',
    'farmer.myCluster.locked': 'Locked - Buyer confirmed',
    'farmer.myCluster.expired': 'Expired - Cluster dissolved',
    'farmer.alternatives.title': 'Alternative Options',
    'farmer.alternatives.subtitle': 'Your cluster has expired. Here are your options:',
    'farmer.alternatives.localBuyers': 'Nearby Local Buyers',
    'farmer.alternatives.nextCycle': 'Join Next Aggregation Cycle',
    'farmer.alternatives.govSupport': 'Government Support Programs',
    
    // Auth
    'auth.login.title': 'Welcome Back',
    'auth.login.subtitle': 'Sign in to your account',
    'auth.register.title': 'Join StubbleStock',
    'auth.register.subtitle': 'Create your account',
    'auth.phone': 'Phone Number',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.role': 'I am a',
    'auth.farmer': 'Farmer / FPO',
    'auth.buyer': 'Bio-Energy Plant',
    'auth.name': 'Full Name',
    'auth.village': 'Village / Location',
    'auth.preferredLanguage': 'Preferred Language',
    'auth.companyName': 'Company Name',
    'auth.plantLocation': 'Plant Location',
    'auth.acceptedCrops': 'Accepted Crop Types',
    'auth.loginBtn': 'Sign In',
    'auth.registerBtn': 'Create Account',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.hasAccount': 'Already have an account?',
  },
  hi: {
    // Navbar
    'nav.howItWorks': 'कैसे काम करता है',
    'nav.impact': 'प्रभाव',
    'nav.login': 'लॉगिन',
    'nav.register': 'रजिस्टर',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.addStubble': 'पराली जोड़ें',
    'nav.myCluster': 'मेरा क्लस्टर',
    'nav.alternatives': 'विकल्प',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.logout': 'लॉगआउट',
    
    // Landing Page
    'hero.title': 'फसल अवशेष को स्वच्छ ऊर्जा में बदलना',
    'hero.subtitle': 'स्टबलस्टॉक किसानों को जैव-ऊर्जा संयंत्रों से जोड़ता है, कृषि अवशेष को नवीकरणीय ईंधन में बदलता है और हानिकारक पराली जलाने को रोकता है।',
    'hero.farmerCta': 'किसान लॉगिन',
    'hero.buyerCta': 'खरीदार लॉगिन',
    
    'problem.title': 'पराली जलाने का संकट',
    'problem.subtitle': 'हर साल, लाखों टन फसल अवशेष जलाए जाते हैं, जिससे गंभीर वायु प्रदूषण और स्वास्थ्य खतरे होते हैं।',
    'problem.card1.title': 'पराली क्यों जलाई जाती है?',
    'problem.card1.desc': 'किसानों के पास कटाई और अगली बुवाई के बीच कम समय होता है। जलाना खेत साफ करने का सबसे तेज़ तरीका है, लेकिन व्यक्तिगत पराली की मात्रा खरीदारों के लिए आर्थिक रूप से संग्रह करने के लिए बहुत कम होती है।',
    'problem.card2.title': 'पर्यावरणीय प्रभाव',
    'problem.card2.desc': 'पराली जलाने से हानिकारक प्रदूषक वातावरण में निकलते हैं, जो शहरों में गंभीर वायु गुणवत्ता समस्याओं और लाखों लोगों के लिए श्वसन स्वास्थ्य समस्याओं में योगदान करते हैं।',
    'problem.card3.title': 'समन्वय की कमी',
    'problem.card3.desc': 'जैव-ऊर्जा संयंत्रों को थोक मात्रा की आवश्यकता होती है, लेकिन व्यक्तिगत किसानों के पास कम मात्रा होती है। एकत्रीकरण के बिना, अर्थशास्त्र किसी के लिए भी काम नहीं करता।',
    
    'solution.title': 'स्टबलस्टॉक कैसे काम करता है',
    'solution.subtitle': 'हम पराली को आर्थिक रूप से व्यवहार्य क्लस्टरों में एकत्रित करके समन्वय समस्या को हल करते हैं।',
    'solution.step1.title': 'किसान पराली घोषित करते हैं',
    'solution.step1.desc': 'किसान अपने फसल अवशेष विवरण पंजीकृत करते हैं जिसमें प्रकार, मात्रा और पिकअप उपलब्धता शामिल है।',
    'solution.step2.title': 'सिस्टम क्लस्टर बनाता है',
    'solution.step2.desc': 'हमारा प्लेटफ़ॉर्म पास के किसानों को ऐसे क्लस्टरों में समूहित करता है जो खरीदारों के लिए न्यूनतम व्यवहार्य मात्रा को पूरा करते हैं।',
    'solution.step3.title': 'खरीदार थोक में खरीदते हैं',
    'solution.step3.desc': 'जैव-ऊर्जा संयंत्र अब एकत्रित क्लस्टर खरीद सकते हैं, जिससे संग्रह आर्थिक रूप से संभव हो जाता है।',
    'solution.step4.title': 'पराली एकत्र, न जलाई',
    'solution.step4.desc': 'पेशेवर संग्रह टीमें पराली उठाती हैं, और किसान जलाने के बजाय आय अर्जित करते हैं।',
    
    'users.title': 'स्टबलस्टॉक का उपयोग कौन करता है',
    'users.farmers.title': 'किसान और एफपीओ',
    'users.farmers.desc': 'व्यक्तिगत किसान और किसान उत्पादक संगठन अपने फसल अवशेष से कमाई कर सकते हैं बजाय जलाने के।',
    'users.bioenergy.title': 'जैव-ऊर्जा संयंत्र',
    'users.bioenergy.desc': 'बिजली संयंत्र और बायोगैस सुविधाओं को बड़े पैमाने पर कृषि बायोमास की विश्वसनीय आपूर्ति मिलती है।',
    'users.pellet.title': 'पेलेट निर्माता',
    'users.pellet.desc': 'जैव-ईंधन और पेलेट उत्पादक एकत्रित क्लस्टरों से कुशलतापूर्वक कच्चा माल प्राप्त कर सकते हैं।',
    
    'impact.title': 'साध्य_प्रभाव',
    'impact.pollution.title': 'प्रदूषण में कमी',
    'impact.pollution.value': '25 लाख+ टन',
    'impact.pollution.desc': 'सालाना CO2 उत्सर्जन रोका गया',
    'impact.farmers.title': 'किसान बचत',
    'impact.farmers.value': '₹15,000+',
    'impact.farmers.desc': 'प्रति किसान औसत अतिरिक्त आय',
    'impact.energy.title': 'स्वच्छ ऊर्जा',
    'impact.energy.value': '500+ MW',
    'impact.energy.desc': 'नवीकरणीय ऊर्जा सक्षम',
    
    'footer.about': 'हमारे बारे में',
    'footer.contact': 'संपर्क',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.copyright': '© 2024 स्टबलस्टॉक। सर्वाधिकार सुरक्षित।',
    
    // Farmer Pages
    'farmer.welcome': 'स्वागत है',
    'farmer.dashboard.title': 'किसान डैशबोर्ड',
    'farmer.dashboard.clusterStatus': 'वर्तमान क्लस्टर स्थिति',
    'farmer.dashboard.noCluster': 'आपने अभी तक कोई क्लस्टर नहीं जुड़ा है',
    'farmer.dashboard.joinCluster': 'क्लस्टर में शामिल हों',
    'farmer.addStubble.title': 'अपनी पराली जोड़ें',
    'farmer.addStubble.cropType': 'फसल का प्रकार',
    'farmer.addStubble.paddy': 'धान',
    'farmer.addStubble.wheat': 'गेहूं',
    'farmer.addStubble.landArea': 'भूमि क्षेत्र (एकड़)',
    'farmer.addStubble.estimatedStubble': 'अनुमानित पराली (टन)',
    'farmer.addStubble.harvestDate': 'कटाई की तारीख',
    'farmer.addStubble.pickupWindow': 'पिकअप समय',
    'farmer.addStubble.submit': 'क्लस्टर में शामिल हों',
    'farmer.myCluster.title': 'मेरा क्लस्टर',
    'farmer.myCluster.clusterId': 'क्लस्टर आईडी',
    'farmer.myCluster.cropType': 'फसल का प्रकार',
    'farmer.myCluster.totalQuantity': 'कुल मात्रा',
    'farmer.myCluster.farmersCount': 'क्लस्टर में किसान',
    'farmer.myCluster.status': 'स्थिति',
    'farmer.myCluster.forming': 'बनाना - अधिक किसानों को इकट्ठा करना',
    'farmer.myCluster.ready': 'तैयार - खरीदार की प्रतीक्षा',
    'farmer.myCluster.locked': 'लॉक्ड - खरीदार पुष्टि',
    'farmer.myCluster.expired': 'समाप्त - क्लस्टर भंग',
    'farmer.alternatives.title': 'वैकल्पिक विकल्प',
    'farmer.alternatives.subtitle': 'आपका क्लस्टर समाप्त हो गया है। यहाँ आपके विकल्प हैं:',
    'farmer.alternatives.localBuyers': 'पास के स्थानीय खरीदार',
    'farmer.alternatives.nextCycle': 'अगले एकत्रीकरण चक्र में शामिल हों',
    'farmer.alternatives.govSupport': 'सरकारी सहायता कार्यक्रम',
    
    // Auth
    'auth.login.title': 'वापसी पर स्वागत है',
    'auth.login.subtitle': 'अपने खाते में साइन इन करें',
    'auth.register.title': 'स्टबलस्टॉक से जुड़ें',
    'auth.register.subtitle': 'अपना खाता बनाएं',
    'auth.phone': 'फोन नंबर',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.role': 'मैं हूं',
    'auth.farmer': 'किसान / एफपीओ',
    'auth.buyer': 'जैव-ऊर्जा संयंत्र',
    'auth.name': 'पूरा नाम',
    'auth.village': 'गांव / स्थान',
    'auth.preferredLanguage': 'पसंदीदा भाषा',
    'auth.companyName': 'कंपनी का नाम',
    'auth.plantLocation': 'संयंत्र स्थान',
    'auth.acceptedCrops': 'स्वीकृत फसल प्रकार',
    'auth.loginBtn': 'साइन इन करें',
    'auth.registerBtn': 'खाता बनाएं',
    'auth.noAccount': 'खाता नहीं है?',
    'auth.hasAccount': 'पहले से खाता है?',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
