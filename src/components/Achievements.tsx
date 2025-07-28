import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Award, 
  Trophy, 
  Target, 
  Calendar,
  Star,
  Flame,
  TrendingDown,
  Crown,
  Lock,
  CheckCircle
} from 'lucide-react';

export default function Achievements() {
  const { user } = useAuth();
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  if (!user) return null;

  // Define all possible achievements
  const allAchievements = [
    {
      id: 'discipline',
      title: 'Disciplina',
      description: 'Registrou peso por 4 semanas consecutivas',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      requirement: '4 semanas consecutivas de registro',
      points: 100,
      type: 'discipline'
    },
    {
      id: 'transformation',
      title: 'Transformação',
      description: 'Perdeu 5kg ou mais',
      icon: TrendingDown,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      requirement: 'Perder 5kg',
      points: 200,
      type: 'transformation'
    },
    {
      id: 'consistency',
      title: 'Consistência',
      description: 'Registrou peso por 8 semanas consecutivas',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      requirement: '8 semanas consecutivas de registro',
      points: 150,
      type: 'consistency'
    },
    {
      id: 'dedication',
      title: 'Dedicação',
      description: 'Perdeu 10kg ou mais',
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      requirement: 'Perder 10kg',
      points: 300,
      type: 'transformation'
    },
    {
      id: 'explorer',
      title: 'Explorador',
      description: 'Visualizou 20 receitas diferentes',
      icon: Star,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      requirement: 'Ver 20 receitas',
      points: 50,
      type: 'engagement'
    },
    {
      id: 'champion',
      title: 'Campeão',
      description: 'Perdeu 15kg ou mais',
      icon: Crown,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      requirement: 'Perder 15kg',
      points: 500,
      type: 'transformation'
    }
  ];

  // Get user's unlocked achievements
  const unlockedAchievements = user.achievements.map(ua => ({
    ...allAchievements.find(a => a.type === ua.type),
    ...ua
  }));

  // Get locked achievements
  const lockedAchievements = allAchievements.filter(
    achievement => !user.achievements.some(ua => ua.type === achievement.type)
  );

  const totalPoints = unlockedAchievements.reduce((sum, achievement) => sum + (achievement.points || 0), 0);
  const progressPercentage = Math.min((totalPoints / 1000) * 100, 100);

  // Calculate current progress for locked achievements
  const getProgress = (achievement) => {
    switch (achievement.type) {
      case 'discipline':
      case 'consistency':
        const requiredWeeks = achievement.id === 'discipline' ? 4 : 8;
        return Math.min((user.weights.length / requiredWeeks) * 100, 100);
      
      case 'transformation':
        const requiredLoss = achievement.id === 'transformation' ? 5 : 
                           achievement.id === 'dedication' ? 10 : 15;
        if (user.weights.length < 2) return 0;
        const firstWeight = user.weights[0].weight;
        const lastWeight = user.weights[user.weights.length - 1].weight;
        const currentLoss = Math.max(0, firstWeight - lastWeight);
        return Math.min((currentLoss / requiredLoss) * 100, 100);
      
      default:
        return 0;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Sistema TAE</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          <strong>Técnica de Acompanhamento de Emagrecimento</strong> - Acompanhe sua evolução através de conquistas e selos especiais!
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold">Sua Pontuação TAE</h3>
            <p className="opacity-90">Continue conquistando selos!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalPoints}</div>
            <div className="text-sm opacity-90">pontos</div>
          </div>
        </div>
        
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-2">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm opacity-90">
          {Math.round(progressPercentage)}% do caminho para Mestre TAE (1000 pontos)
        </p>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{unlockedAchievements.length}</p>
          <p className="text-sm text-gray-600">Conquistas</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{totalPoints}</p>
          <p className="text-sm text-gray-600">Pontos TAE</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{user.weights.length}</p>
          <p className="text-sm text-gray-600">Registros</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Flame className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {user.weights.length >= 2 
              ? Math.max(0, user.weights[0].weight - user.weights[user.weights.length - 1].weight).toFixed(1)
              : '0.0'
            }
          </p>
          <p className="text-sm text-gray-600">kg Perdidos</p>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span>Conquistas Desbloqueadas</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <div className="text-center space-y-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{achievement.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${achievement.bgColor} ${achievement.textColor}`}>
                        +{achievement.points} pontos
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Lock className="h-6 w-6 text-gray-400" />
            <span>Próximas Conquistas</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedAchievements.map((achievement) => {
              const Icon = achievement.icon;
              const progress = getProgress(achievement);
              
              return (
                <div
                  key={achievement.id}
                  className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all cursor-pointer"
                  onClick={() => setSelectedAchievement(achievement)}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto relative">
                      <Icon className="h-8 w-8 text-gray-500" />
                      <Lock className="h-4 w-4 text-gray-600 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-600 text-lg">{achievement.title}</h4>
                      <p className="text-gray-500 text-sm mt-1">{achievement.description}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${achievement.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">{Math.round(progress)}% completo</span>
                        <span className="text-gray-400">+{achievement.points} pontos</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="text-center space-y-6">
              <div className={`w-20 h-20 bg-gradient-to-r ${selectedAchievement.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
                <selectedAchievement.icon className="h-10 w-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedAchievement.title}</h3>
                <p className="text-gray-600 mb-4">{selectedAchievement.description}</p>
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${selectedAchievement.bgColor} ${selectedAchievement.textColor}`}>
                  +{selectedAchievement.points} pontos TAE
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Requisito</h4>
                <p className="text-gray-600 text-sm">{selectedAchievement.requirement}</p>
              </div>

              {selectedAchievement.unlockedAt && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🎉 Conquistado!</h4>
                  <p className="text-green-700 text-sm">
                    Desbloqueado em {new Date(selectedAchievement.unlockedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedAchievement(null)}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State for No Achievements */}
      {unlockedAchievements.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Comece sua jornada TAE!</h3>
          <p className="text-gray-500 mb-6">
            Registre seu peso regularmente e desbloqueie suas primeiras conquistas.
          </p>
        </div>
      )}

      {/* Motivational Message */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-xl text-white text-center">
        <h3 className="text-xl font-bold mb-2">💪 Continue Firme!</h3>
        <p className="opacity-90">
          {unlockedAchievements.length === 0 
            ? "Sua primeira conquista está a apenas alguns registros de distância!"
            : `Você já conquistou ${unlockedAchievements.length} selo${unlockedAchievements.length !== 1 ? 's' : ''}! Continue assim!`
          }
        </p>
      </div>
    </div>
  );
}