import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Award, 
  Crown,
  Calendar,
  Target,
  Flame,
  Users
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const { user } = useAuth();

  if (!user) return null;

  const planExpiry = new Date(user.planExpiry);
  const today = new Date();
  const daysLeft = Math.ceil((planExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const latestWeight = user.weights.length > 0 ? user.weights[user.weights.length - 1] : null;
  const previousWeight = user.weights.length > 1 ? user.weights[user.weights.length - 2] : null;
  const weightChange = latestWeight && previousWeight ? latestWeight.weight - previousWeight.weight : 0;

  const quickActions = [
    {
      title: 'Explorar Receitas',
      description: 'Descubra receitas saudáveis para sua dieta',
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      action: () => setActiveTab('recipes'),
      premium: false
    },
    {
      title: 'Calcular IMC',
      description: 'Verifique seu índice de massa corporal',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      action: () => setActiveTab('bmi'),
      premium: false
    },
    {
      title: 'Registrar Peso',
      description: 'Acompanhe sua evolução semanal',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      action: () => setActiveTab('weight'),
      premium: false
    },
    {
      title: 'Ver Conquistas',
      description: 'Acompanhe seu progresso TAE',
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      action: () => setActiveTab('achievements'),
      premium: false
    }
  ];

  const stats = [
    {
      label: 'Receitas Disponíveis',
      value: user.plan === 'premium' ? '50+' : '10',
      icon: BookOpen,
      color: 'text-green-600'
    },
    {
      label: 'Registros de Peso',
      value: user.weights.length.toString(),
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      label: 'Conquistas',
      value: user.achievements.length.toString(),
      icon: Award,
      color: 'text-yellow-600'
    },
    {
      label: 'Dias Restantes',
      value: daysLeft > 0 ? daysLeft.toString() : '0',
      icon: Calendar,
      color: user.plan === 'premium' ? 'text-green-600' : 'text-red-600'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Olá, {user.name}! 👋
        </h1>
        <p className="text-gray-600 text-lg">
          {user.plan === 'premium' 
            ? 'Continue sua jornada de transformação!'
            : 'Que tal fazer upgrade para Premium e ter acesso completo?'
          }
        </p>
      </div>

      {/* Plan Status */}
      <div className={`p-6 rounded-2xl shadow-lg ${
        user.plan === 'premium' 
          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
          : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {user.plan === 'premium' ? (
              <Crown className="h-8 w-8 text-yellow-300" />
            ) : (
              <Users className="h-8 w-8" />
            )}
            <div>
              <h3 className="text-xl font-bold">
                Plano {user.plan === 'premium' ? 'Premium' : 'Free'}
              </h3>
              <p className="opacity-90">
                {daysLeft > 0 
                  ? `${daysLeft} dias restantes`
                  : 'Plano expirado'
                }
              </p>
            </div>
          </div>
          {user.plan === 'free' && (
            <button className="bg-white text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Fazer Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <Icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weight Progress */}
      {latestWeight && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Último Registro de Peso</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-800">{latestWeight.weight} kg</p>
              <p className="text-sm text-gray-600">
                Registrado em {latestWeight.date.toLocaleDateString('pt-BR')}
              </p>
            </div>
            {previousWeight && (
              <div className={`px-4 py-2 rounded-lg ${
                weightChange < 0 
                  ? 'bg-green-100 text-green-800' 
                  : weightChange > 0 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                <span className="font-semibold">
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const canAccess = !action.premium || user.plan === 'premium';
            
            return (
              <button
                key={index}
                onClick={canAccess ? action.action : undefined}
                disabled={!canAccess}
                className={`
                  p-6 rounded-xl text-left transition-all transform hover:scale-105 shadow-sm border
                  ${canAccess 
                    ? 'bg-white hover:shadow-lg border-gray-100' 
                    : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{action.title}</h4>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                    {!canAccess && (
                      <div className="flex items-center space-x-1 mt-2">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">Premium</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      {user.achievements.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Conquistas Recentes</h3>
          <div className="space-y-3">
            {user.achievements.slice(-2).map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-xl text-white text-center">
        <h3 className="text-xl font-bold mb-2">💪 Lembre-se</h3>
        <p className="text-lg opacity-90">
          "Cada pequeno passo te leva mais perto do seu objetivo. Continue firme!"
        </p>
      </div>
    </div>
  );
}