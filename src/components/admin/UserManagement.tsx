import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { users } from '../../data/users';
import { 
  Users, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Crown, 
  Calendar,
  TrendingUp,
  Award,
  Plus,
  Shield
} from 'lucide-react';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Acesso Negado</h3>
        <p className="text-gray-500">Você não tem permissão para acessar esta área.</p>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserStats = (user) => {
    const latestWeight = user.weights.length > 0 ? user.weights[user.weights.length - 1] : null;
    const firstWeight = user.weights.length > 0 ? user.weights[0] : null;
    const weightLoss = latestWeight && firstWeight ? firstWeight.weight - latestWeight.weight : 0;
    
    return {
      weightsCount: user.weights.length,
      achievementsCount: user.achievements.length,
      weightLoss: weightLoss.toFixed(1),
      daysActive: Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      planDaysLeft: Math.ceil((new Date(user.planExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    };
  };

  const getPlanStatusColor = (daysLeft) => {
    if (daysLeft <= 0) return 'bg-red-100 text-red-800';
    if (daysLeft <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  if (selectedUser) {
    const stats = getUserStats(selectedUser);
    
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedUser(null)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
        >
          <span>←</span>
          <span>Voltar à lista</span>
        </button>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Header */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h1>
                  <p className="text-gray-600">{selectedUser.email}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedUser.plan === 'premium' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedUser.plan === 'premium' ? (
                        <span className="flex items-center space-x-1">
                          <Crown className="h-4 w-4" />
                          <span>Premium</span>
                        </span>
                      ) : (
                        'Free'
                      )}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanStatusColor(stats.planDaysLeft)}`}>
                      {stats.planDaysLeft > 0 ? `${stats.planDaysLeft} dias restantes` : 'Expirado'}
                    </span>
                    {selectedUser.isAdmin && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit3 className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{stats.weightsCount}</p>
              <p className="text-sm text-gray-600">Registros</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{stats.achievementsCount}</p>
              <p className="text-sm text-gray-600">Conquistas</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{stats.weightLoss} kg</p>
              <p className="text-sm text-gray-600">Perdidos</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{stats.daysActive}</p>
              <p className="text-sm text-gray-600">Dias Ativo</p>
            </div>
          </div>

          {/* Weight History */}
          {selectedUser.weights.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Peso</h3>
              <div className="space-y-3">
                {selectedUser.weights.slice(-5).reverse().map((weight, index) => (
                  <div key={weight.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{weight.weight} kg</p>
                      <p className="text-sm text-gray-600">
                        {new Date(weight.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {weight.notes && (
                      <p className="text-sm text-gray-600 italic">"{weight.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {selectedUser.achievements.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Conquistas TAE</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedUser.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <Award className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(achievement.unlockedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-500" />
            <span>Gerenciar Usuários</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Administre os usuários da plataforma Viva Leve 30+
          </p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Usuário</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Plano</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Atividade</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => {
                const stats = getUserStats(user);
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.plan === 'premium' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.plan === 'premium' ? 'Premium' : 'Free'}
                        </span>
                        {user.isAdmin && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanStatusColor(stats.planDaysLeft)}`}>
                        {stats.planDaysLeft > 0 ? `${stats.planDaysLeft} dias` : 'Expirado'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        <p>{stats.weightsCount} registros</p>
                        <p>{stats.achievementsCount} conquistas</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Ver Detalhes
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          <p className="text-sm text-gray-600">Total de Usuários</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {users.filter(u => u.plan === 'premium').length}
          </p>
          <p className="text-sm text-gray-600">Usuários Premium</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {users.filter(u => u.weights.length > 0).length}
          </p>
          <p className="text-sm text-gray-600">Usuários Ativos</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
          <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-800">
            {users.reduce((sum, u) => sum + u.achievements.length, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Conquistas</p>
        </div>
      </div>
    </div>
  );
}