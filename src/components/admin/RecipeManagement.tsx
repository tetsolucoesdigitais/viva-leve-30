import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recipes } from '../../data/recipes';
import { Recipe } from '../../types';
import { 
  ChefHat, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Plus,
  Eye,
  Shield,
  Clock,
  Users,
  Flame
} from 'lucide-react';

export default function RecipeManagement() {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vegana' | 'cetogenica' | 'lowcarb'>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showAddRecipe, setShowAddRecipe] = useState(false);

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Acesso Negado</h3>
        <p className="text-gray-500">Você não tem permissão para acessar esta área.</p>
      </div>
    );
  }

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Todas', count: recipes.length },
    { id: 'vegana', label: 'Veganas', count: recipes.filter(r => r.category === 'vegana').length },
    { id: 'cetogenica', label: 'Cetogênicas', count: recipes.filter(r => r.category === 'cetogenica').length },
    { id: 'lowcarb', label: 'Low Carb', count: recipes.filter(r => r.category === 'lowcarb').length }
  ];

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vegana': return '🌱';
      case 'cetogenica': return '🥑';
      case 'lowcarb': return '🥗';
      default: return '🍽️';
    }
  };

  if (selectedRecipe) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedRecipe(null)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
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
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                  <Edit3 className="h-5 w-5 text-gray-600" />
                </button>
                <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedRecipe.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <span>{getCategoryIcon(selectedRecipe.category)}</span>
                      <span className="capitalize">{selectedRecipe.category.replace('cetogenica', 'cetogênica')}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedRecipe.prepTime} min</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Flame className="h-4 w-4" />
                      <span>{selectedRecipe.nutrition.calories} kcal</span>
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                  {getDifficultyLabel(selectedRecipe.difficulty)}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Ingredients */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Ingredientes</h3>
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
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Sugestões de Substituições</h3>
                      <ul className="space-y-2">
                        {selectedRecipe.substitutions.map((substitution, index) => (
                          <li key={index} className="text-gray-700 flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
            <ChefHat className="h-8 w-8 text-green-500" />
            <span>Gerenciar Receitas</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Administre o banco de receitas do Viva Leve 30+
          </p>
        </div>
        <button
          onClick={() => setShowAddRecipe(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Receita</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <div className="text-2xl mb-2">
              {category.id === 'all' ? '🍽️' : getCategoryIcon(category.id)}
            </div>
            <p className="text-2xl font-bold text-gray-800">{category.count}</p>
            <p className="text-sm text-gray-600">{category.label}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar receitas ou ingredientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </button>
        </div>

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
              <span>{category.id === 'all' ? '🍽️' : getCategoryIcon(category.id)}</span>
              <span>{category.label}</span>
              <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredRecipes.length} receita{filteredRecipes.length !== 1 ? 's' : ''} encontrada{filteredRecipes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
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
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white p-1.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-600" />
                </button>
                <button className="bg-white p-1.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                  <Edit3 className="h-4 w-4 text-blue-600" />
                </button>
                <button className="bg-white p-1.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span>{getCategoryIcon(recipe.category)}</span>
                <span className="text-xs text-gray-500 capitalize">
                  {recipe.category.replace('cetogenica', 'cetogênica')}
                </span>
              </div>
              
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{recipe.name}</h3>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.prepTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="h-4 w-4" />
                  <span>{recipe.nutrition.calories} kcal</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                <span>P: {recipe.nutrition.protein}g</span>
                <span>C: {recipe.nutrition.carbs}g</span>
                <span>G: {recipe.nutrition.fat}g</span>
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