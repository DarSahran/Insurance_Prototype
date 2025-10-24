import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Newspaper, Award, TrendingUp, Users } from 'lucide-react';

const PressPage: React.FC = () => {
  const navigate = useNavigate();

  const pressReleases = [
    {
      date: 'January 15, 2025',
      title: 'SmartCover AI Raises $15M in Series A Funding',
      description: 'Leading venture capital firms back our mission to revolutionize insurance through artificial intelligence.',
      category: 'Funding'
    },
    {
      date: 'December 10, 2024',
      title: 'SmartCover AI Achieves 78% Accuracy in Risk Assessment',
      description: 'Our proprietary AI model sets new industry standard, surpassing traditional methods by 11x.',
      category: 'Technology'
    },
    {
      date: 'November 5, 2024',
      title: 'Partnership with 50+ Major Insurance Providers',
      description: 'Strategic partnerships expand our reach across India, serving millions of customers.',
      category: 'Partnerships'
    },
    {
      date: 'October 20, 2024',
      title: 'SmartCover AI Wins InsurTech Innovation Award 2024',
      description: 'Recognized for excellence in AI-powered insurance underwriting and customer service.',
      category: 'Awards'
    },
    {
      date: 'September 8, 2024',
      title: 'Reaching 25,000 Happy Customers Milestone',
      description: 'Our commitment to fair, transparent insurance reaches new heights.',
      category: 'Growth'
    }
  ];

  const mediaKit = [
    { name: 'Company Logo (PNG)', size: '2.4 MB' },
    { name: 'Brand Guidelines', size: '1.8 MB' },
    { name: 'Product Screenshots', size: '5.2 MB' },
    { name: 'Executive Headshots', size: '3.1 MB' }
  ];

  const stats = [
    { label: 'Media Mentions', value: '150+' },
    { label: 'Industry Awards', value: '8' },
    { label: 'Press Releases', value: '25+' },
    { label: 'Partner Publications', value: '40+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Press & Media</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Latest news, press releases, and media resources from SmartCover AI.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
                        {release.category}
                      </span>
                      <span className="text-sm text-gray-500">{release.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{release.title}</h3>
                    <p className="text-gray-600">{release.description}</p>
                  </div>
                  <Newspaper className="w-8 h-8 text-blue-600 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Kit</h2>
            <p className="text-gray-600 mb-6">
              Download our media kit for logos, brand guidelines, and high-resolution images.
            </p>
            <div className="space-y-3">
              {mediaKit.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <span className="text-sm text-gray-500">{item.size}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
            >
              Request Media Kit
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">Press Contact</h2>
            <p className="mb-6">
              For media inquiries, interviews, or press information, please contact our communications team.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <div className="text-blue-100 text-sm mb-1">Email</div>
                <div className="font-semibold">darsahran12@gmail.com</div>
              </div>
              <div>
                <div className="text-blue-100 text-sm mb-1">Phone</div>
                <div className="font-semibold">+91 9797974779</div>
              </div>
              <div>
                <div className="text-blue-100 text-sm mb-1">Response Time</div>
                <div className="font-semibold">Within 24 hours</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-white text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-all font-semibold"
            >
              Contact Us
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Award className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Industry Recognition</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            SmartCover AI has been recognized by leading industry publications and organizations for our
            innovative approach to insurance technology and customer service excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-semibold">
              InsurTech Innovation Award 2024
            </span>
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-semibold">
              Best AI Implementation 2024
            </span>
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-semibold">
              Customer Choice Award 2024
            </span>
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-semibold">
              Top 50 FinTech Startups
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressPage;
