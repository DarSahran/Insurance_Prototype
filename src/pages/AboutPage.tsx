import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Target, Users, Award, TrendingUp, Heart, ArrowLeft } from 'lucide-react';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust & Security',
      description: 'We prioritize data security and privacy, ensuring all customer information is protected with industry-leading encryption.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Accuracy',
      description: 'Our AI models deliver 78% accuracy in risk assessment, far exceeding traditional methods at 7-10%.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Customer First',
      description: 'Every decision we make is centered around providing the best experience and value for our customers.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Fair & Unbiased',
      description: 'We eliminate bias through AI-powered fairness detection, ensuring equitable treatment for everyone.'
    }
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Co-Founder', expertise: 'Insurance Industry Veteran' },
    { name: 'Michael Chen', role: 'CTO & Co-Founder', expertise: 'AI & Machine Learning Expert' },
    { name: 'Emily Rodriguez', role: 'Chief Data Scientist', expertise: 'Risk Analytics Specialist' },
    { name: 'David Kim', role: 'Head of Product', expertise: 'Product Strategy & UX' }
  ];

  const milestones = [
    { year: '2024', event: 'Company Founded', description: 'Started with a vision to revolutionize insurance' },
    { year: '2025', event: 'First AI Model', description: 'Launched our proprietary risk assessment algorithm' },
    { year: '2026', event: '10,000 Users', description: 'Reached our first major user milestone' },
    { year: '2026', event: '78% Accuracy', description: 'Achieved industry-leading prediction accuracy' },
    { year: '2027', event: 'Series A Funding', description: 'Raised $15M to expand our platform' },
    { year: '2028', event: '50+ Partners', description: 'Partnered with major insurance providers across India' }
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
          <h1 className="text-5xl font-bold text-gray-900 mb-6">About SmartCover AI</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing insurance through artificial intelligence, making coverage more accessible,
            fair, and personalized for everyone.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            <p>
              SmartCover AI was born from a simple observation: the traditional insurance industry was failing to
              serve people fairly and efficiently. Long wait times, biased assessments, and opaque pricing left
              millions underinsured or paying too much.
            </p>
            <p>
              Our founders, with backgrounds in insurance and artificial intelligence, came together to build a
              better solution. By leveraging cutting-edge machine learning and data analytics, we've created a
              platform that assesses risk with unprecedented accuracy while eliminating human bias.
            </p>
            <p>
              Today, we serve over 25,000 customers across India, providing them with personalized insurance
              recommendations and instant quotes. Our AI processes applications 90% faster than traditional
              methods, reducing weeks of waiting to just minutes.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 md:p-12 mb-16 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-2xl font-bold mb-2">{milestone.year}</div>
                <h3 className="text-xl font-semibold mb-2">{milestone.event}</h3>
                <p className="text-blue-100">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're building the future of insurance. If you're passionate about technology and making a
            difference in people's lives, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/careers')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
            >
              View Open Positions
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-all font-semibold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
