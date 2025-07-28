import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Award, 
  Settings, 
  Users, 
  Webhook,
  Crown,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', premium: false },
    { id: 'recipes', icon: BookOpen, label: 'Receitas', premium: false },
    { id: 'exercises', icon: TrendingUp, label: 'Vídeos de Exercícios', premium: true },
    { id: 'bmi', icon: Calculator, label: 'Calculadora IMC', premium: false },
    { id: 'weight', icon: TrendingUp, label: 'Registro de Peso', premium: false },
    { id: 'achievements', icon: Award, label: 'Conquistas TAE', premium: false },
  ];

  const adminItems = [
    { id: 'users', icon: Users, label: 'Gerenciar Usuários' },
    { id: 'manage-recipes', icon: Settings, label: 'Gerenciar Receitas' },
    { id: 'webhook', icon: Webhook, label: 'Teste Webhook Kiwify' },
  ];

  const isMenuItemAccessible = (item: any) => {
    if (!item.premium) return true;
    return user?.plan === 'premium';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">VL</span>
              </div>
              <span className="ml-2 font-bold text-gray-800">Menu</span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <div className="flex items-center space-x-1">
                    {user.plan === 'premium' && <Crown className="h-3 w-3 text-yellow-500" />}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.plan === 'premium' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.plan === 'premium' ? 'Premium' : 'Free'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const accessible = isMenuItemAccessible(item);
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (accessible) {
                      setActiveTab(item.id);
                      onClose();
                    }
                  }}
                  disabled={!accessible}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all
                    ${activeTab === item.id 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md' 
                      : accessible
                        ? 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        : 'text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {!accessible && (
                    <Crown className="h-4 w-4 text-yellow-500 ml-auto" />
                  )}
                </button>
              );
            })}

            {/* Admin Section */}
            {user?.isAdmin && (
              <>
                <div className="pt-4 pb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3">
                    Administração
                  </p>
                </div>
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        onClose();
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all
                        ${activeTab === item.id 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </>
            )}
          </nav>

          {/* Upgrade Banner */}
          {user?.plan === 'free' && (
            <div className="p-4 border-t border-gray-100">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="h-5 w-5" />
                  <span className="font-bold text-sm">Upgrade Premium</span>
                </div>
                <p className="text-xs mb-3">
                  Acesso ilimitado a todas as receitas e recursos avançados!
                </p>
                <button className="w-full bg-white text-orange-600 text-sm font-bold py-2 px-3 rounded-md hover:bg-gray-50 transition-colors">
                  Fazer Upgrade
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}