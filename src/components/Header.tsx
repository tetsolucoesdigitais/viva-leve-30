import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Crown, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center ml-2 md:ml-0">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">VL</span>
              </div>
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Viva Leve 30+
              </h1>
            </div>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.plan === 'premium' && (
                  <Crown className="h-5 w-5 text-yellow-500" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.plan === 'premium' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.plan === 'premium' ? 'Premium' : 'Free'}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}