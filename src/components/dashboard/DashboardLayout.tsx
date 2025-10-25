import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Shield, Activity, Heart, DollarSign,
  Users, FileCheck, HelpCircle, Settings, LogOut, Menu, X, Bell,
  TrendingUp, MessageSquare, Home, BookOpen
} from 'lucide-react';
import { useHybridAuth } from '../../hooks/useHybridAuth';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useHybridAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'Assessments', path: '/dashboard/assessments' },
    { icon: Shield, label: 'My Policies', path: '/dashboard/policies' },
    { icon: Activity, label: 'Risk Dashboard', path: '/dashboard/risk' },
    { icon: Heart, label: 'Health Tracking', path: '/dashboard/health' },
    { icon: TrendingUp, label: 'Financial Planning', path: '/dashboard/financial-planning' },
    { icon: Users, label: 'Family Management', path: '/dashboard/family' },
    { icon: FileCheck, label: 'Claims', path: '/dashboard/claims' },
    { icon: DollarSign, label: 'Payments', path: '/dashboard/payments' },
    { icon: BookOpen, label: 'Terminology', path: '/dashboard/terminology' },
    { icon: MessageSquare, label: 'AI Advisor', path: '/dashboard/ai-recommendations' },
    { icon: HelpCircle, label: 'Help Center', path: '/dashboard/help' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">InsureAI</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile & Settings */}
          <div className="border-t border-gray-200 p-4 space-y-2">
            <Link
              to="/dashboard/profile"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/dashboard/profile'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">Premium Member</p>
                </div>
                <Link
                  to="/dashboard/profile"
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition-colors"
                >
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
