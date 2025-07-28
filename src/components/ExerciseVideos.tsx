import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Play, 
  Clock, 
  Star, 
  Filter, 
  Search,
  Crown,
  Dumbbell,
  Heart,
  Zap,
  Smile
} from 'lucide-react';

interface ExerciseVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  category: 'cardio' | 'strength' | 'flexibility' | 'hiit';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  is_premium: boolean;
}

const exerciseVideos: ExerciseVideo[] = [
  {
    id: '1',
    title: 'Cardio HIIT para Iniciantes',
    description: 'Treino de alta intensidade de 15 minutos para queimar gordura rapidamente. Perfeito para quem está começando.',
    video_url: 'https://example.com/video1',
    thumbnail_url: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg',
    duration: 15,
    category: 'hiit',
    difficulty: 'beginner',
    is_premium: true
  },
  {
    id: '2',
    title: 'Fortalecimento Core Avançado',
    description: 'Exercícios específicos para fortalecer o abdômen e core, melhorando postura e estabilidade.',
    video_url: 'https://example.com/video2',
    thumbnail_url: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg',
    duration: 20,
    category: 'strength',
    difficulty: 'intermediate',
    is_premium: true
  },
  {
    id: '3',
    title: 'Yoga para Flexibilidade',
    description: 'Sequência relaxante de yoga para melhorar a flexibilidade e reduzir o estresse do dia a dia.',
    video_url: 'https://example.com/video3',
    thumbnail_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
    duration: 30,
    category: 'flexibility',
    difficulty: 'beginner',
    is_premium: true
  },
  {
    id: '4',
    title: 'Cardio Dança Divertida',
    description: 'Queime calorias dançando! Uma forma divertida e eficaz de fazer exercício cardiovascular.',
    video_url: 'https://example.com/video4',
    thumbnail_url: 'https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg',
    duration: 25,
    category: 'cardio',
    difficulty: 'beginner',
    is_premium: true
  },
  {
    id: '5',
    title: 'Treino de Força em Casa',
    description: 'Desenvolva músculos usando apenas o peso do corpo. Ideal para treinar em casa sem equipamentos.',
    video_url: 'https://example.com/video5',
    thumbnail_url: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
    duration: 35,
    category: 'strength',
    difficulty: 'intermediate',
    is_premium: true
  },
  {
    id: '6',
    title: 'HIIT Extremo - Queima Máxima',
    description: 'Treino intenso para atletas avançados. Máxima queima de calorias em apenas 20 minutos.',
    video_url: 'https://example.com/video6',
    thumbnail_url: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg',
    duration: 20,
    category: 'hiit',
    difficulty: 'advanced',
    is_premium: true
  }
];

export default function ExerciseVideos() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cardio' | 'strength' | 'flexibility' | 'hiit'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedVideo, setSelectedVideo] = useState<ExerciseVideo | null>(null);

  const categories = [
    { id: 'all', label: 'Todos', icon: Dumbbell, color: 'text-gray-600' },
    { id: 'cardio', label: 'Cardio', icon: Heart, color: 'text-red-500' },
    { id: 'strength', label: 'Força', icon: Dumbbell, color: 'text-blue-500' },
    { id: 'flexibility', label: 'Flexibilidade', icon: Smile, color: 'text-green-500' },
    { id: 'hiit', label: 'HIIT', icon: Zap, color: 'text-orange-500' }
  ];

  const difficulties = [
    { id: 'all', label: 'Todos' },
    { id: 'beginner', label: 'Iniciante' },
    { id: 'intermediate', label: 'Intermediário' },
    { id: 'advanced', label: 'Avançado' }
  ];

  const filteredVideos = exerciseVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || video.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return difficulty;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'cardio': return 'Cardio';
      case 'strength': return 'Força';
      case 'flexibility': return 'Flexibilidade';
      case 'hiit': return 'HIIT';
      default: return category;
    }
  };

  // Check if user has premium access
  const hasPremiumAccess = user?.plan === 'premium';

  if (!hasPremiumAccess) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Vídeos de Exercícios Premium</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Acesse nossa biblioteca completa de vídeos de exercícios com o plano Premium por apenas R$ 19,99/mês.
          </p>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-xl text-white max-w-md mx-auto">
            <h4 className="font-bold text-lg mb-2">O que você terá acesso:</h4>
            <ul className="text-left space-y-2 text-sm">
              <li>✅ 20+ vídeos de exercícios</li>
              <li>✅ Treinos para todos os níveis</li>
              <li>✅ Cardio, força, flexibilidade e HIIT</li>
              <li>✅ Novos vídeos toda semana</li>
              <li>✅ Sem equipamentos necessários</li>
            </ul>
            <button className="w-full bg-white text-orange-600 font-bold py-3 px-6 rounded-lg mt-4 hover:bg-gray-50 transition-colors">
              Fazer Upgrade para Premium
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedVideo) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedVideo(null)}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
        >
          <span>←</span>
          <span>Voltar aos vídeos</span>
        </button>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Video Player */}
            <div className="aspect-video bg-gray-900 relative">
              <img
                src={selectedVideo.thumbnail_url}
                alt={selectedVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-110">
                  <Play className="h-12 w-12 text-gray-800 ml-1" />
                </button>
              </div>
              <div className="absolute bottom-4 right-4">
                <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedVideo.duration} min</span>
                </span>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedVideo.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="capitalize">{getCategoryLabel(selectedVideo.category)}</span>
                    <span>•</span>
                    <span>{selectedVideo.duration} minutos</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedVideo.difficulty)}`}>
                      {getDifficultyLabel(selectedVideo.difficulty)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {selectedVideo.description}
                </p>
              </div>

              {/* Tips */}
              <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-3">💡 Dicas para o Treino</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Mantenha uma garrafa de água por perto</li>
                  <li>• Faça um aquecimento de 5 minutos antes de começar</li>
                  <li>• Escute seu corpo e faça pausas quando necessário</li>
                  <li>• Use roupas confortáveis e tênis adequado</li>
                  <li>• Mantenha o ambiente bem ventilado</li>
                </ul>
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
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Vídeos de Exercícios</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Treine em casa com nossa biblioteca completa de vídeos de exercícios. 
          Cardio, força, flexibilidade e HIIT para todos os níveis!
        </p>
      </div>

      {/* Premium Badge */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg text-white text-center">
        <div className="flex items-center justify-center space-x-2">
          <Crown className="h-5 w-5" />
          <span className="font-semibold">Conteúdo Premium Exclusivo</span>
        </div>
        <p className="text-sm opacity-90 mt-1">
          Você tem acesso completo a todos os vídeos de exercícios!
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar vídeos de exercícios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
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
          {filteredVideos.length} vídeo{filteredVideos.length !== 1 ? 's' : ''} encontrado{filteredVideos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:scale-105"
          >
            <div className="aspect-video bg-gray-200 relative">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play className="h-12 w-12 text-white" />
              </div>
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(video.difficulty)}`}>
                  {getDifficultyLabel(video.difficulty)}
                </span>
              </div>
              <div className="absolute bottom-2 right-2">
                <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{video.duration} min</span>
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="capitalize">{getCategoryLabel(video.category)}</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Premium</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum vídeo encontrado</h3>
          <p className="text-gray-500">
            Tente ajustar os filtros ou buscar por outros termos.
          </p>
        </div>
      )}
    </div>
  );
}