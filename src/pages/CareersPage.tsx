import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Briefcase, TrendingUp, Users, Heart, Zap } from 'lucide-react';

const CareersPage: React.FC = () => {
  const navigate = useNavigate();

  const openPositions = [
    {
      title: 'Senior Machine Learning Engineer',
      department: 'Engineering',
      location: 'Pune, India / Remote',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Build and optimize AI models for risk assessment and fraud detection.'
    },
    {
      title: 'Full Stack Developer',
      department: 'Engineering',
      location: 'Pune, India / Hybrid',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Develop scalable web applications using React, Node.js, and modern cloud technologies.'
    },
    {
      title: 'Data Scientist',
      department: 'Data Science',
      location: 'Bangalore, India / Remote',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Analyze complex datasets and build predictive models to improve insurance underwriting.'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Mumbai, India / Hybrid',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead product strategy and roadmap for our insurance platform.'
    },
    {
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Create intuitive and beautiful user experiences for our insurance products.'
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Pune, India / Remote',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Build and maintain scalable infrastructure and CI/CD pipelines.'
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Competitive Salary',
      description: 'Industry-leading compensation with equity options'
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health Insurance',
      description: 'Comprehensive health coverage for you and your family'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Flexible Hours',
      description: 'Work when you\'re most productive'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Remote Work',
      description: 'Work from anywhere in India'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Learning Budget',
      description: '₹50,000 annual learning and development budget'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Latest Tech',
      description: 'Work with cutting-edge AI and cloud technologies'
    }
  ];

  const culture = [
    {
      title: 'Innovation First',
      description: 'We encourage experimentation and new ideas. Failed experiments are learning opportunities.'
    },
    {
      title: 'Transparent Communication',
      description: 'Open door policy. Everyone has a voice, regardless of title or tenure.'
    },
    {
      title: 'Work-Life Balance',
      description: 'We believe in working smart, not long. Your well-being matters to us.'
    },
    {
      title: 'Diversity & Inclusion',
      description: 'We celebrate differences and build a culture where everyone belongs.'
    }
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
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Help us revolutionize insurance with AI. We're looking for talented individuals who are passionate
            about technology and making a real impact.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 md:p-12 mb-16 text-white">
          <h2 className="text-3xl font-bold mb-6">Why SmartCover AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {culture.map((item, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-blue-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{position.title}</h3>
                    <p className="text-gray-600 mb-4">{position.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{position.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{position.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{position.experience}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/contact')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold whitespace-nowrap"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Don't See Your Role?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for exceptional talent. Send us your resume and tell us why you'd be a
            great fit for SmartCover AI.
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;
