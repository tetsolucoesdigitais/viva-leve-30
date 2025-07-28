import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { recipes } from '../data/recipes';
import { Recipe } from '../types';
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Flame, 
  Crown,
  ChefHat,
  Star
} from 'lucide-react';

export default function Recipes() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vegana' | 'cetogenica' | 'lowcarb'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const categories = [
    { id: 'all', label: 'Todas', icon: '🍽️' },
    { id: 'vegana', label: 'Veganas', icon: '🌱' },
    { id: 'cetogenica', label: 'Cetogênicas', icon: '🥑' },
    { id: 'lowcarb', label: 'Low Carb', icon: '🥗' }
  ];

  const difficulties = [
    { id: 'all', label: 'Todas' },
    { id: 'easy', label: 'Fácil' },
    { id: 'medium', label: 'Médio' },
    { id: 'hard', label: 'Difícil' }
  ];

  const filteredRecipes = useMemo(() => {
    let filtered = recipes.filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Limit for free users
    if (user?.plan === 'free') {
      filtered = filtered.slice(0, 10);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty, user?.plan]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return difficulty;
    }
  };

  if (selectedRecipe) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedRecipe(null)}
          className="mb-6 text-green-600 hover:text-green-700 font-medium flex items-center space-x-2"
        >
          <span>←</span>
          <span>Voltar às receitas</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                  {getDifficultyLabel(selectedRecipe.difficulty)}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedRecipe.prepTime} min</span>
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedRecipe.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="capitalize">{selectedRecipe.category.replace('cetogenica', 'cetogênica')}</span>
                    <span>•</span>
                    <span>{selectedRecipe.prepTime} minutos</span>
                    <span>•</span>
                    <span>{selectedRecipe.nutrition.calories} kcal</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Ingredients */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                      <ChefHat className="h-5 w-5" />
                      <span>Ingredientes</span>
                    </h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Modo de Preparo</h3>
                    <ol className="space-y-3">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex space-x-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 pt-1">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {selectedRecipe.substitutions.length > 0 && (
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Sugestões de Substituições</h3>
                      <ul className="space-y-2">
                        {selectedRecipe.substitutions.map((substitution, index) => (
                          <li key={index} className="text-gray-700 flex items-center space-x-2">
                            <Star className="h-4 w-4 text-blue-500" />
                            <span>{substitution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Nutrition */}
                <div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Informações Nutricionais</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calorias</span>
                        <span className="font-semibold">{selectedRecipe.nutrition.calories} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Proteínas</span>
                        <span className="font-semibold">{selectedRecipe.nutrition.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carboidratos</span>
                        <span className="font-semibold">{selectedRecipe.nutrition.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gorduras</span>
                        <span className="font-semibold">{selectedRecipe.nutrition.fat}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Receitas Saudáveis</h1>
        <p className="text-gray-600">
          {user?.plan === 'premium' 
            ? 'Acesso completo a todas as receitas!'
            : `Acesso a 10 receitas no plano Free. Faça upgrade para mais!`
          }
        </p>
      </div>

      {/* Plan Status */}
      {user?.plan === 'free' && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5" />
              <span className="font-semibold">Upgrade para Premium</span>
            </div>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-50 transition-colors">
              Fazer Upgrade
            </button>
          </div>
          <p className="text-sm opacity-90 mt-2">
            Tenha acesso a mais de 50 receitas exclusivas!
          </p>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar receitas ou ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dificuldade</label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
        </p>
        {user?.plan === 'free' && filteredRecipes.length >= 10 && (
          <p className="text-sm text-orange-600 font-medium">
            Mostrando apenas 10 receitas do plano Free
          </p>
        )}
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="aspect-video bg-gray-200 relative">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg';
                }}
              />
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {getDifficultyLabel(recipe.difficulty)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{recipe.name}</h3>
              <p className="text-sm text-gray-600 mb-3 capitalize">
                {recipe.category.replace('cetogenica', 'cetogênica')}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.prepTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="h-4 w-4" />
                  <span>{recipe.nutrition.calories} kcal</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>Proteína: {recipe.nutrition.protein}g</span>
                <span>Carbs: {recipe.nutrition.carbs}g</span>
                <span>Gordura: {recipe.nutrition.fat}g</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma receita encontrada</h3>
          <p className="text-gray-500">
            Tente ajustar os filtros ou buscar por outros termos.
          </p>
        </div>
      )}
    </div>
  );
}