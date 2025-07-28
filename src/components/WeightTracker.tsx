import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { checkAchievements, getMotivationalMessage } from '../utils/achievements';
import { WeightEntry } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2,
  Scale,
  Target,
  Award
} from 'lucide-react';

export default function WeightTracker() {
  const { user, updateUser } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [showAchievement, setShowAchievement] = useState(null);

  if (!user) return null;

  const sortedWeights = [...user.weights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestWeight = sortedWeights[0];
  const previousWeight = sortedWeights[1];
  const weightChange = latestWeight && previousWeight ? latestWeight.weight - previousWeight.weight : 0;
  const totalChange = sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1].weight - sortedWeights[0].weight : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightNum = parseFloat(weight);
    if (weightNum <= 0) return;

    if (editingEntry) {
      // Edit existing entry
      const updatedWeights = user.weights.map(entry => 
        entry.id === editingEntry.id 
          ? { ...entry, weight: weightNum, notes: notes.trim() }
          : entry
      );
      updateUser({ weights: updatedWeights });
      setEditingEntry(null);
    } else {
      // Add new entry
      const newEntry: WeightEntry = {
        id: Date.now().toString(),
        weight: weightNum,
        date: new Date(),
        notes: notes.trim()
      };

      const updatedWeights = [...user.weights, newEntry];
      updateUser({ weights: updatedWeights });

      // Check for new achievements
      const newAchievements = checkAchievements({ ...user, weights: updatedWeights });
      if (newAchievements.length > 0) {
        const allAchievements = [...user.achievements, ...newAchievements];
        updateUser({ achievements: allAchievements });
        setShowAchievement(newAchievements[0]);
      }

      setIsAdding(false);
    }

    setWeight('');
    setNotes('');
  };

  const handleEdit = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setWeight(entry.weight.toString());
    setNotes(entry.notes || '');
    setIsAdding(true);
  };

  const handleDelete = (entryId: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      const updatedWeights = user.weights.filter(entry => entry.id !== entryId);
      updateUser({ weights: updatedWeights });
    }
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingEntry(null);
    setWeight('');
    setNotes('');
  };

  const motivationalMessage = latestWeight && previousWeight 
    ? getMotivationalMessage(weightChange) 
    : null;

  return (
    <div className="p-6 space-y-8">
      {/* Achievement Modal */}
      {showAchievement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">🎉 Parabéns!</h3>
            <h4 className="text-xl font-semibold text-yellow-600 mb-2">{showAchievement.title}</h4>
            <p className="text-gray-600 mb-6">{showAchievement.description}</p>
            <button
              onClick={() => setShowAchievement(null)}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
            <Scale className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Registro de Peso</h1>
        </div>
        <p className="text-gray-600">
          Acompanhe sua evolução semanal e celebrate cada conquista!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Weight */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Scale className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Peso Atual</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {latestWeight ? `${latestWeight.weight} kg` : '-- kg'}
          </p>
          {latestWeight && (
            <p className="text-sm text-gray-500 mt-1">
              {new Date(latestWeight.date).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        {/* Weight Change */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              weightChange < 0 ? 'bg-green-100' : weightChange > 0 ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              {weightChange < 0 ? (
                <TrendingDown className="h-5 w-5 text-green-600" />
              ) : weightChange > 0 ? (
                <TrendingUp className="h-5 w-5 text-red-600" />
              ) : (
                <Target className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <h3 className="font-semibold text-gray-800">Última Variação</h3>
          </div>
          <p className={`text-3xl font-bold ${
            weightChange < 0 ? 'text-green-600' : weightChange > 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {weightChange !== 0 ? (weightChange > 0 ? '+' : '') + weightChange.toFixed(1) + ' kg' : '-- kg'}
          </p>
          {motivationalMessage && (
            <p className={`text-sm mt-1 ${
              motivationalMessage.type === 'success' ? 'text-green-600' :
              motivationalMessage.type === 'warning' ? 'text-red-600' : 'text-blue-600'
            }`}>
              {motivationalMessage.message}
            </p>
          )}
        </div>

        {/* Total Change */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              totalChange < 0 ? 'bg-green-100' : totalChange > 0 ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800">Mudança Total</h3>
          </div>
          <p className={`text-3xl font-bold ${
            totalChange < 0 ? 'text-green-600' : totalChange > 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {totalChange !== 0 ? (totalChange > 0 ? '+' : '') + totalChange.toFixed(1) + ' kg' : '-- kg'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {sortedWeights.length} registro{sortedWeights.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Add Weight Form */}
      {isAdding ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingEntry ? 'Editar Registro' : 'Novo Registro de Peso'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="300"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: 70.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações (opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Como você se sente hoje?"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                {editingEntry ? 'Salvar Alterações' : 'Adicionar Registro'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2 mx-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Registrar Peso</span>
          </button>
        </div>
      )}

      {/* Weight History */}
      {sortedWeights.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Histórico de Peso</span>
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {sortedWeights.map((entry, index) => {
              const nextEntry = sortedWeights[index + 1];
              const change = nextEntry ? entry.weight - nextEntry.weight : 0;
              
              return (
                <div key={entry.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-gray-800">{entry.weight} kg</p>
                        <p className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        {entry.notes && (
                          <p className="text-sm text-gray-600 mt-1">"{entry.notes}"</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {change !== 0 && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          change < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)} kg
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedWeights.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum registro ainda</h3>
          <p className="text-gray-500 mb-6">
            Comece registrando seu peso atual para acompanhar sua evolução.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Fazer Primeiro Registro
          </button>
        </div>
      )}
    </div>
  );
}