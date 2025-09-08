import React, { useState } from 'react';
import { 
  Search, BookOpen, MessageSquare, Phone, Mail,
  Video, Download, ExternalLink, ChevronRight, ChevronDown,
  ThumbsUp, ThumbsDown, Clock, CheckCircle, Users,
  FileText, Shield, DollarSign, Car, Home, Heart
} from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Mock data
  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen, count: 45 },
    { id: 'policies', name: 'Policies', icon: Shield, count: 12 },
    { id: 'claims', name: 'Claims', icon: FileText, count: 8 },
    { id: 'billing', name: 'Billing & Payments', icon: DollarSign, count: 6 },
    { id: 'auto', name: 'Auto Insurance', icon: Car, count: 7 },
    { id: 'home', name: 'Home Insurance', icon: Home, count: 5 },
    { id: 'health', name: 'Health Insurance', icon: Heart, count: 7 }
  ];

  const popularArticles = [
    {
      id: 1,
      title: 'How to File a Claim',
      description: 'Step-by-step guide to filing your insurance claim online',
      category: 'claims',
      readTime: '5 min',
      helpful: 124,
      views: 1850
    },
    {
      id: 2,
      title: 'Understanding Your Policy Coverage',
      description: 'Learn what is and isn\'t covered by your insurance policy',
      category: 'policies',
      readTime: '8 min',
      helpful: 98,
      views: 1420
    },
    {
      id: 3,
      title: 'Setting Up Auto-Pay',
      description: 'How to set up automatic premium payments',
      category: 'billing',
      readTime: '3 min',
      helpful: 76,
      views: 1120
    },
    {
      id: 4,
      title: 'What to Do After an Accident',
      description: 'Essential steps to take immediately after a car accident',
      category: 'auto',
      readTime: '6 min',
      helpful: 145,
      views: 2100
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I update my personal information?',
      answer: 'You can update your personal information by going to Settings > Profile and editing the required fields. Make sure to save your changes.',
      category: 'account'
    },
    {
      id: 2,
      question: 'What documents do I need to file a claim?',
      answer: 'Required documents typically include: incident report, photos of damage, receipts for expenses, and any relevant third-party reports. Specific requirements may vary by claim type.',
      category: 'claims'
    },
    {
      id: 3,
      question: 'How long does claim processing take?',
      answer: 'Most claims are processed within 5-10 business days. Complex claims may take longer. You\'ll receive regular updates on your claim status.',
      category: 'claims'
    },
    {
      id: 4,
      question: 'Can I change my payment method?',
      answer: 'Yes, you can add, remove, or modify payment methods in the Payments section of your dashboard. Changes take effect on your next billing cycle.',
      category: 'billing'
    },
    {
      id: 5,
      question: 'How do I download my policy documents?',
      answer: 'Policy documents can be downloaded from the Policies section of your dashboard or the Document Center. Look for the download icon next to each document.',
      category: 'policies'
    }
  ];

  const contactOptions = [
    {
      id: 1,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 9 AM - 6 PM EST',
      icon: MessageSquare,
      action: 'Start Chat',
      primary: true
    },
    {
      id: 2,
      title: 'Phone Support',
      description: '1-800-INSURANCE',
      availability: '24/7 Support',
      icon: Phone,
      action: 'Call Now',
      primary: false
    },
    {
      id: 3,
      title: 'Email Support',
      description: 'support@insurance.com',
      availability: 'Response within 24 hours',
      icon: Mail,
      action: 'Send Email',
      primary: false
    },
    {
      id: 4,
      title: 'Video Call',
      description: 'Schedule a video consultation',
      availability: 'By appointment',
      icon: Video,
      action: 'Schedule',
      primary: false
    }
  ];

  const resources = [
    {
      id: 1,
      title: 'Insurance Glossary',
      description: 'Understand common insurance terms',
      type: 'document',
      icon: BookOpen
    },
    {
      id: 2,
      title: 'Policy Comparison Guide',
      description: 'Compare different policy options',
      type: 'pdf',
      icon: Download
    },
    {
      id: 3,
      title: 'Claims Process Video',
      description: 'Watch how to file a claim',
      type: 'video',
      icon: Video
    },
    {
      id: 4,
      title: 'Customer Portal Tutorial',
      description: 'Learn to use your dashboard',
      type: 'external',
      icon: ExternalLink
    }
  ];

  const filteredArticles = popularArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600 mb-8">Find answers to your questions and get the help you need</p>
        
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactOptions.map(option => {
          const Icon = option.icon;
          return (
            <div
              key={option.id}
              className={`p-6 rounded-xl border-2 text-center transition-all hover:shadow-lg ${
                option.primary 
                  ? 'border-blue-200 bg-blue-50 hover:border-blue-300' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <Icon className={`w-8 h-8 mx-auto mb-3 ${option.primary ? 'text-blue-600' : 'text-gray-600'}`} />
              <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{option.description}</p>
              <p className="text-xs text-gray-500 mb-3">{option.availability}</p>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  option.primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.action}
              </button>
            </div>
          );
        })}
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
                <span className="text-sm text-gray-500">({category.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Articles */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Popular Articles</h2>
          
          <div className="space-y-4">
            {filteredArticles.map(article => (
              <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{article.helpful} helpful</span>
                      </div>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-3">
            {filteredFAQs.map(faq => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFAQ === faq.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm text-gray-500">Was this helpful?</span>
                      <button className="flex items-center space-x-1 text-green-600 hover:text-green-800">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">Yes</span>
                      </button>
                      <button className="flex items-center space-x-1 text-red-600 hover:text-red-800">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">No</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map(resource => {
            const Icon = resource.icon;
            return (
              <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <Icon className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-medium text-gray-900 mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-blue-900">Still Need Help?</h2>
        </div>
        <p className="text-blue-800 mb-6">
          Can't find what you're looking for? Our support team is here to help you with any questions or concerns.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <MessageSquare className="w-5 h-5" />
            <span>Start Live Chat</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100">
            <Phone className="w-5 h-5" />
            <span>Call Support</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100">
            <Mail className="w-5 h-5" />
            <span>Send Email</span>
          </button>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Service Status</h2>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">All Systems Operational</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            'Customer Portal',
            'Claims Processing',
            'Payment System',
            'Mobile App',
            'Customer Support'
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <span className="text-gray-900">{service}</span>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Operational</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
