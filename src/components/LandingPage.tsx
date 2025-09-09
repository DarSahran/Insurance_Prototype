import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Shield, Zap, Target, Eye, Star, CheckCircle,
  TrendingUp, Award, Lock, FileCheck, User, Clock, DollarSign,
  Users, ArrowRight, X, Menu, Globe,
  Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram,
  Sparkles, Brain, Database, Activity, PieChart,
  ExternalLink, LogOut
} from 'lucide-react';
import { demoScenarios } from '../data/demoData';
import { useHybridAuth } from '../hooks/useHybridAuth';
import youngProfessionalImg from '../assets/Young Professional.jpg';
import middleProfessionalImg from '../assets/middle Professional.jpg';
import seniorProfessionalImg from '../assets/senior Professional.jpg';

interface LandingPageProps {
  onStartAssessment: () => void;
  onLoadDemoScenario?: (scenario: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAssessment, onLoadDemoScenario }) => {
  const navigate = useNavigate();
  const { user, signOut } = useHybridAuth();
  const [animatedStats, setAnimatedStats] = useState({ speed: 0, accuracy: 0, processing: 0, users: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({ hero: false, features: false, demo: false });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [emailSubscription, setEmailSubscription] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [liveUsers, setLiveUsers] = useState(127);


  const handleSignOut = async () => {
    try {
      // Set logout flag before clearing storage
      sessionStorage.setItem('logging_out', 'true');
      
      // Sign out from auth provider first
      await signOut();
      
      // Clear all browser storage after sign out
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear IndexedDB if it exists
      if (window.indexedDB) {
        try {
          const databases = await window.indexedDB.databases();
          databases.forEach(db => {
            if (db.name) window.indexedDB.deleteDatabase(db.name);
          });
        } catch (e) {
          // Ignore IndexedDB errors
        }
      }
      
      // Force page reload to clear all state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Force page reload even if logout fails
      window.location.reload();
    }
  };

  // Handle assessment start with authentication check
  const handleStartAssessment = () => {
    if (user) {
      // User is logged in, proceed to assessment
      onStartAssessment();
    } else {
      // User is not logged in, redirect to signup
      navigate('/signup');
    }
  };
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) setIsVisible(prev => ({ ...prev, hero: true }));
            if (entry.target === featuresRef.current) setIsVisible(prev => ({ ...prev, features: true }));
            if (entry.target === demoRef.current) setIsVisible(prev => ({ ...prev, demo: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (demoRef.current) observer.observe(demoRef.current);

    return () => observer.disconnect();
  }, []);

  // Animated stats
  useEffect(() => {
    const animateStats = () => {
      let speed = 0, accuracy = 0, processing = 0, users = 0;
      const interval = setInterval(() => {
        if (speed < 90) speed += 2;
        if (accuracy < 78) accuracy += 1.5;
        if (processing < 95) processing += 2.5;
        if (users < 25000) users += 500;
        
        setAnimatedStats({ speed, accuracy, processing, users });
        
        if (speed >= 90 && accuracy >= 78 && processing >= 95 && users >= 25000) {
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Live user counter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotating testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Feature rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % interactiveFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const valueProps = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Lightning Fast",
      description: "90% reduction in processing time - from weeks to minutes",
      stat: `${Math.round(animatedStats.speed)}%`,
      color: "from-blue-500 to-blue-600",
      improvement: "vs Traditional: 40 days → 5 minutes",
      badge: "Speed"
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Precise Risk Assessment",
      description: "78% accuracy in predicting risk scenarios vs 7-10% traditional methods",
      stat: `${Math.round(animatedStats.accuracy)}%`,
      color: "from-green-500 to-green-600",
      improvement: "11x more accurate predictions",
      badge: "Accuracy"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Bias-Free Evaluation",
      description: "AI-powered fairness detection ensures equitable treatment",
      stat: `${Math.round(animatedStats.processing)}%`,
      color: "from-indigo-500 to-indigo-600",
      improvement: "Eliminates human bias completely",
      badge: "Fairness"
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Explainable Decisions",
      description: "Clear explanations for every recommendation using SHAP values",
      stat: "100%",
      color: "from-purple-500 to-purple-600",
      improvement: "Full transparency on every decision",
      badge: "Transparency"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      company: "Johnson & Associates",
      content: "Got my policy quote in under 4 minutes. The AI explanation helped me understand exactly why I qualified for lower rates. Saved $2,400 annually!",
      rating: 5,
      avatar: youngProfessionalImg,
      savings: "$2,400",
      timeframe: "Annual",
      location: "New York, NY"
    },
    {
      name: "Michael Chen",
      role: "Family Father",
      company: "Tech Professional",
      content: "The transparency is incredible. I could see exactly how my health improvements affected my premium in real-time. My family's coverage is now perfectly optimized.",
      rating: 5,
      avatar: middleProfessionalImg,
      savings: "$1,800",
      timeframe: "Annual",
      location: "San Francisco, CA"
    },
    {
      name: "Dr. Emily Davis",
      role: "Healthcare Professional",
      company: "Memorial Hospital",
      content: "As a doctor, I appreciate how the AI considers comprehensive health data for fair pricing. The medical data integration is revolutionary and respectful.",
      rating: 5,
      avatar: seniorProfessionalImg,
      savings: "$3,200",
      timeframe: "Annual",
      location: "Boston, MA"
    },
    {
      name: "Robert Martinez",
      role: "Retiree",
      company: "Former Finance Executive",
      content: "At 65, I thought insurance would be expensive. The AI found factors others missed and got me comprehensive coverage at an amazing rate.",
      rating: 5,
      avatar: seniorProfessionalImg,
      savings: "$4,100",
      timeframe: "Annual",
      location: "Miami, FL"
    }
  ];

  const interactiveFeatures = [
    {
      icon: <Brain className="w-12 h-12 text-blue-600" />,
      title: "Advanced AI Models",
      description: "Ensemble of Random Forest, XGBoost, and Neural Networks",
      details: "Our AI processes 200+ data points simultaneously"
    },
    {
      icon: <Database className="w-12 h-12 text-green-600" />,
      title: "Comprehensive Data Integration",
      description: "EMR, lifestyle, wearables, and traditional risk factors",
      details: "Analyzes patterns across multiple data sources"
    },
    {
      icon: <Activity className="w-12 h-12 text-purple-600" />,
      title: "Real-time Risk Scoring",
      description: "Dynamic assessment that adapts to your changing profile",
      details: "Updates recommendations as your health improves"
    },
    {
      icon: <PieChart className="w-12 h-12 text-orange-600" />,
      title: "Bias Detection Engine",
      description: "Continuous fairness monitoring across all demographics",
      details: "Ensures equal treatment regardless of background"
    }
  ];

  const industryStats = [
    { label: "Processing Time Reduced", value: "90%", icon: <Clock className="w-5 h-5" /> },
    { label: "Cost Savings", value: "$160B", icon: <DollarSign className="w-5 h-5" /> },
    { label: "Happy Customers", value: "25K+", icon: <Users className="w-5 h-5" /> },
    { label: "Accuracy Rate", value: "78%", icon: <Target className="w-5 h-5" /> }
  ];

  const handleEmailSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubscribing(false);
    setEmailSubscription('');
    alert('Thank you for subscribing! You\'ll receive updates about our platform.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Enhanced Header with Mobile Menu */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Shield className="w-8 h-8 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">SmartCover AI</span>
                <div className="text-xs text-gray-500">Powered by Advanced AI</div>
              </div>
            </div>

            {/* Responsive Navigation */}
            <nav className="flex-1 flex items-center justify-end space-x-8">
              <div className="hidden lg:flex items-center space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
                <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Demo</a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Reviews</a>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{liveUsers} users online</span>
                </div>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{user.email}</span>
                    </div>
                    <button
                      className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                )}
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="bg-white w-80 h-full shadow-xl flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold">Navigation</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="space-y-6">
                  <a href="#features" className="block text-gray-800 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                  <a href="#demo" className="block text-gray-800 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Demo</a>
                  <a href="#testimonials" className="block text-gray-800 font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Reviews</a>
                  <button
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mt-4"
                    onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                  >
                    Login
                  </button>
                  <button
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium mt-2"
                    onClick={() => { setIsMobileMenuOpen(false); handleStartAssessment(); }}
                  >
                    Start Assessment
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section ref={heroRef} className="py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              {/* Announcement Badge */}
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>New: 78% accuracy rate achieved!</span>
                <ExternalLink className="w-4 h-4" />
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Get Your Personalized 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Insurance Quote </span> 
                in Under 5 Minutes
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AI-powered risk assessment for fair and accurate pricing. Experience the future of insurance underwriting with transparent, unbiased decisions backed by advanced machine learning.
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={handleStartAssessment}
                  className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-lg font-semibold relative overflow-hidden"
                >
                  <span>{user ? 'Continue Assessment' : 'Start Your Assessment'}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </div>

              {/* Industry Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {industryStats.map((stat, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-4 text-center shadow-sm">
                    <div className="flex justify-center mb-2 text-blue-600">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.label === "Happy Customers" ? `${Math.round(animatedStats.users / 1000)}K+` : stat.value}
                    </div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>SOC 2 Certified</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>AI Ethics Verified</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>ISO 27001</span>
                </div>
              </div>
            </div>

            {/* Enhanced Dashboard Preview */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="bg-white rounded-2xl shadow-2xl p-8 relative">
                {/* Live indicator */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">LIVE</span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-blue-600" />
                  Real-Time Performance
                </h3>
                
                <div className="space-y-6">
                  {valueProps.map((prop, index) => (
                    <div key={index} className="group hover:bg-gray-50 rounded-lg p-3 -m-3 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${prop.color} flex items-center justify-center text-white relative overflow-hidden`}>
                          {prop.icon}
                          <div className="absolute top-0 right-0 w-3 h-3 bg-white/30 rounded-bl-lg"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <div>
                              <span className="font-semibold text-gray-900">{prop.title}</span>
                              <div className="text-xs text-blue-600 font-medium">{prop.badge}</div>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-gray-900">{prop.stat}</span>
                              <div className="text-xs text-green-600">{prop.improvement}</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                            <div 
                              className={`h-3 rounded-full bg-gradient-to-r ${prop.color} transition-all duration-2000 ease-out relative`}
                              style={{ width: prop.stat }}
                            >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* System Status */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-semibold">All Systems Operational</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-700">99.9% Uptime</div>
                      <div className="text-xs text-green-600">Last update: 2 hours ago</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-green-700">
                    <div>🔄 Models: Updated</div>
                    <div>⚡ API: Fast</div>
                    <div>🛡️ Security: Active</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-bounce"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-purple-500 rounded-full opacity-20 animate-bounce delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Interactive Features Demo */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Technology in Action</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our advanced AI processes your information in real-time
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Feature Navigation */}
              <div className="space-y-4">
                {interactiveFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      activeFeature === index 
                        ? 'bg-blue-50 border-2 border-blue-200 shadow-md' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${activeFeature === index ? 'bg-white shadow-sm' : 'bg-white'}`}>
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Feature Display */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
                <div className="mb-6">
                  {interactiveFeatures[activeFeature].icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{interactiveFeatures[activeFeature].title}</h3>
                <p className="text-blue-100 mb-6">{interactiveFeatures[activeFeature].details}</p>
                
                {/* Simulated Processing */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Processing Status</span>
                    <span>Active</span>
                  </div>
                  <div className="w-full bg-blue-800 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full animate-pulse" style={{width: '85%'}}></div>
                  </div>
                  <div className="text-sm text-blue-200">
                    2.3 seconds average processing time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Value Propositions */}
      <section ref={featuresRef} id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AI-Powered Underwriting?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the revolutionary difference between traditional and intelligent insurance assessment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <div 
                key={index} 
                className={`group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible.features ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${prop.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {prop.icon}
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{prop.title}</h3>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${prop.color} text-white`}>
                      {prop.badge}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{prop.stat}</div>
                  <div className="text-sm text-green-600 font-medium">{prop.improvement}</div>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-4">{prop.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>Industry Leading</span>
                  </div>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Demo Preview */}
      <section ref={demoRef} id="demo" className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl font-bold mb-4">See AI in Action</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Watch how our AI processes your information and generates personalized quotes in real-time
            </p>
          </div>

          <div className={`bg-white rounded-2xl shadow-2xl p-8 max-w-6xl mx-auto transform transition-all duration-1000 ${
            isVisible.demo ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-8">
              <div className="space-y-4 flex flex-col">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto relative">
                  <FileCheck className="w-10 h-10 text-blue-600" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">1</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Data Collection</h3>
                <p className="text-gray-600 flex-grow">Intelligent forms with 200+ optimized data points</p>
                <div className="bg-blue-50 rounded-lg p-4 mt-auto">
                  <div className="text-3xl font-bold text-blue-600">5 min</div>
                  <div className="text-sm text-gray-500">Average completion</div>
                  <div className="text-xs text-green-600 mt-1">⚡ 60% faster than competitors</div>
                </div>
              </div>

              <div className="space-y-4 flex flex-col">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto relative">
                  <Brain className="w-10 h-10 text-green-600" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">2</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI Processing</h3>
                <p className="text-gray-600 flex-grow">Advanced ML models with bias detection</p>
                <div className="bg-green-50 rounded-lg p-4 mt-auto">
                  <div className="text-3xl font-bold text-green-600">2.3s</div>
                  <div className="text-sm text-gray-500">Processing time</div>
                  <div className="text-xs text-green-600 mt-1">🚀 100x faster than traditional</div>
                </div>
              </div>

              <div className="space-y-4 flex flex-col">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto relative">
                  <Target className="w-10 h-10 text-purple-600" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">3</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Personalized Results</h3>
                <p className="text-gray-600 flex-grow">Transparent pricing with detailed explanations</p>
                <div className="bg-purple-50 rounded-lg p-4 mt-auto">
                  <div className="text-3xl font-bold text-purple-600">78%</div>
                  <div className="text-sm text-gray-500">Accuracy rate</div>
                  <div className="text-xs text-green-600 mt-1">🎯 11x more accurate</div>
                </div>
              </div>
            </div>

            {/* Process Flow Visualization */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Live Processing Simulation</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data Validation</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-full"></div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Analysis</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                    <Activity className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bias Check</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full w-1/2"></div>
                    </div>
                    <Shield className="w-4 h-4 text-indigo-500" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={handleStartAssessment}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Try It Now - Free Assessment
              </button>
              <p className="text-sm text-gray-500 mt-3">
                ✓ No credit card required ✓ Instant results ✓ GDPR compliant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Demo Scenarios */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Try Realistic Demo Scenarios</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our AI system with pre-configured scenarios representing real-world situations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoScenarios.map((scenario) => (
              <div key={scenario.id} className="group bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden flex flex-col h-full">
                <div className="relative">
                  <img 
                    src={scenario.avatar} 
                    alt={scenario.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-xs font-bold text-gray-700 shadow-sm">
                    {scenario.expectedOutcome.riskScore <= 30 ? '🟢 Low Risk' :
                     scenario.expectedOutcome.riskScore <= 70 ? '🟡 Medium Risk' : '🔴 High Risk'}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{scenario.name}</h3>
                    <p className="text-gray-600">{scenario.description}</p>
                    <div className="text-sm text-gray-500 mt-1">{scenario.demographics.location}</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-600">Risk Score</div>
                      <div className={`text-xl font-bold ${
                        scenario.expectedOutcome.riskScore <= 30 ? 'text-green-600' :
                        scenario.expectedOutcome.riskScore <= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {scenario.expectedOutcome.riskScore}/100
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-600">Premium</div>
                      <div className="text-xl font-bold text-blue-600">${scenario.expectedOutcome.monthlyPremium}/mo</div>
                    </div>
                  </div>

                  <div className="mb-6 flex-grow">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Potential Savings</span>
                      <span className="font-bold text-green-600">{scenario.expectedOutcome.savings}% annually</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${scenario.expectedOutcome.savings}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onLoadDemoScenario && onLoadDemoScenario(scenario)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold flex items-center justify-center space-x-2 group-hover:shadow-lg mt-auto"
                  >
                    <User className="w-4 h-4" />
                    <span>Try This Scenario</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials with Carousel */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-600">Real experiences from real customers who saved with our AI platform</p>
          </div>

          {/* Featured Testimonial */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mb-12">
            <div className="text-center mb-8">
              <img 
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100"
              />
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl italic text-gray-700 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div className="mt-6">
                <div className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</div>
                <div className="text-gray-600">{testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}</div>
                <div className="text-sm text-gray-500 mt-1">{testimonials[currentTestimonial].location}</div>
                <div className="mt-4 inline-flex items-center space-x-4">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Saved {testimonials[currentTestimonial].savings} {testimonials[currentTestimonial].timeframe}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-gray-100"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 italic mb-4">"{testimonial.content.substring(0, 120)}..."</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600 font-medium">{testimonial.savings} saved</span>
                  <span className="text-gray-500">{testimonial.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated on AI Insurance Innovation
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get insights on AI advancements, industry trends, and exclusive early access to new features
          </p>
          
          <form onSubmit={handleEmailSubscription} className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="email"
                value={emailSubscription}
                onChange={(e) => setEmailSubscription(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-blue-300"
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="bg-white text-blue-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
          
          <p className="text-blue-200 text-sm mt-4">
            Join 12,000+ industry professionals. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Experience the Future of Insurance?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands who've already revolutionized their insurance experience with AI-powered underwriting. Get started in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">5 Minutes</h3>
              <p className="text-gray-400">Complete assessment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">100% Secure</h3>
              <p className="text-gray-400">GDPR compliant</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Save 30%+</h3>
              <p className="text-gray-400">On average annually</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={handleStartAssessment}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg text-xl font-semibold relative overflow-hidden group"
            >
              <span>{user ? 'Continue Your Assessment' : 'Get Your Personalized Quote Now'}</span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <p className="text-gray-400 text-sm">
              ✓ No commitment required ✓ 5-minute assessment ✓ Instant results ✓ Free consultation
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold">SmartCover AI</span>
              </div>
              <p className="text-gray-400 mb-6">
                Revolutionizing insurance through AI-powered risk assessment and personalized underwriting.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Risk Assessment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Personalized Quotes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bias Detection</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Integration</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4" />
                  <span>+91 9797974779</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4" />
                  <span>darsahran12@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4" />
                  <span>Pune, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>&copy; 2025 SmartCover AI. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Add custom CSS animations
const styles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default LandingPage;
