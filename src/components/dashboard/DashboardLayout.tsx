import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Home, User, Shield, FileText, Brain, TrendingUp, Heart,
  DollarSign, Users, Upload, FileCheck, CreditCard, MessageCircle,
  Settings, HelpCircle, Menu, X, Bell, Search, LogOut, ChevronDown, BookOpen
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Policies', href: '/dashboard/policies', icon: Shield },
    { name: 'Assessments', href: '/dashboard/assessments', icon: FileText },
    { name: 'AI Insights', href: '/dashboard/ai-insights', icon: Brain },
    { name: 'Risk Monitoring', href: '/dashboard/risk', icon: TrendingUp },
    { name: 'Health Tracking', href: '/dashboard/health', icon: Heart },
    { name: 'Financial Planning', href: '/dashboard/financial', icon: DollarSign },
    { name: 'Family Management', href: '/dashboard/family', icon: Users },
    { name: 'Documents', href: '/dashboard/documents', icon: Upload },
    { name: 'Claims', href: '/dashboard/claims', icon: FileCheck },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
    { name: 'Provider Network', href: '/dashboard/providers', icon: Users },
    { name: 'Terminology Glossary', href: '/dashboard/glossary', icon: BookOpen },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Help Center', href: '/dashboard/help', icon: HelpCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, slide-in on mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">SmartCover AI</h1>
              <p className="text-xs text-gray-600">Insurance Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" style={{ height: 'calc(100vh - 128px)' }}>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top navigation bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left side - Menu button and search */}
            <div className="flex items-center space-x-4 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="hidden sm:block flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search dashboard..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Notifications and profile */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-400" />
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
