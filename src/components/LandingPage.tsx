import React, { useState, useEffect } from 'react';
import { ChevronRight, Shield, Zap, Target, Eye, Star, Users, CheckCircle, BarChart3, Clock, TrendingUp, Play, Award, Lock, FileCheck } from 'lucide-react';

interface LandingPageProps {
  onStartAssessment: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAssessment }) => {
  const [animatedStats, setAnimatedStats] = useState({ speed: 0, accuracy: 0, processing: 0 });

  useEffect(() => {
    const animateStats = () => {
      let speed = 0, accuracy = 0, processing = 0;
      const interval = setInterval(() => {
        if (speed < 90) speed += 2;
        if (accuracy < 78) accuracy += 1.5;
        if (processing < 95) processing += 2.5;
        
        setAnimatedStats({ speed, accuracy, processing });
        
        if (speed >= 90 && accuracy >= 78 && processing >= 95) {
          clearInterval(interval);
        }
      }, 50);
      
      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  const valueProps = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Lightning Fast",
      description: "90% reduction in processing time - from weeks to minutes",
      stat: `${Math.round(animatedStats.speed)}%`,
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Precise Risk Assessment",
      description: "78% accuracy in predicting risk scenarios vs 7-10% traditional methods",
      stat: `${Math.round(animatedStats.accuracy)}%`,
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Bias-Free Evaluation",
      description: "AI-powered fairness detection ensures equitable treatment",
      stat: `${Math.round(animatedStats.processing)}%`,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: <Eye className="w-8 h-8 text-purple-600" />,
      title: "Explainable Decisions",
      description: "Clear explanations for every recommendation using SHAP values",
      stat: "100%",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "Got my policy quote in under 4 minutes. The AI explanation helped me understand exactly why I qualified for lower rates.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Family Father",
      content: "The transparency is incredible. I could see exactly how my health improvements affected my premium in real-time.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      name: "Dr. Emily Davis",
      role: "Healthcare Professional",
      content: "As a doctor, I appreciate how the AI considers comprehensive health data for fair pricing. Revolutionary approach.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SmartCover AI</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900 transition-colors">Demo</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Login
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Get Your Personalized 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Insurance Quote</span> 
                in Under 5 Minutes
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AI-powered risk assessment for fair and accurate pricing. Experience the future of insurance underwriting with transparent, unbiased decisions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={onStartAssessment}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <span>Start Your Assessment</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-lg font-semibold">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Lock className="w-4 h-4" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>SOC 2 Certified</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>AI Ethics Verified</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Live Performance Metrics</h3>
                
                <div className="space-y-6">
                  {valueProps.map((prop, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${prop.color} flex items-center justify-center text-white`}>
                        {prop.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-gray-900">{prop.title}</span>
                          <span className="text-2xl font-bold text-gray-900">{prop.stat}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${prop.color} transition-all duration-1000 ease-out`}
                            style={{ width: prop.stat }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-semibold">System Status: Operational</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">AI models updated 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AI-Powered Underwriting?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the revolutionary difference between traditional and intelligent insurance assessment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${prop.color} flex items-center justify-center mb-4`}>
                  {prop.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{prop.title}</h3>
                <p className="text-gray-600 leading-relaxed">{prop.description}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>Industry Leading</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Preview */}
      <section id="demo" className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-4xl font-bold mb-4">See AI in Action</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Watch how our AI processes your information and generates personalized quotes in real-time
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <FileCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Data Input</h3>
                <p className="text-gray-600">Secure form with 200+ data points</p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">5 min</div>
                  <div className="text-sm text-gray-500">Average completion</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI Processing</h3>
                <p className="text-gray-600">Risk analysis & bias detection</p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">2.3 sec</div>
                  <div className="text-sm text-gray-500">Processing time</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Personalized Quote</h3>
                <p className="text-gray-600">Transparent pricing with explanations</p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">78%</div>
                  <div className="text-sm text-gray-500">Accuracy rate</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={onStartAssessment}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
              >
                Try It Now - It's Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-gray-600">Real experiences from real customers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
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
                
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience the Future of Insurance?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands who've already saved time and money with AI-powered underwriting
          </p>
          
          <button 
            onClick={onStartAssessment}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg text-xl font-semibold"
          >
            Get Your Quote Now
          </button>
          
          <p className="text-gray-400 mt-4 text-sm">No commitment required • 5-minute assessment • Instant results</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;