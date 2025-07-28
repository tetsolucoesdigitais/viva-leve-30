import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Heart, Utensils, TrendingUp } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(email, password);
        if (!success) {
          setError('Email ou senha incorretos');
        }
      } else {
        if (name.length < 2) {
          setError('Nome deve ter pelo menos 2 caracteres');
          return;
        }
        const success = await register(name, email, password);
        if (!success) {
          setError('Email já está em uso');
        }
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setIsLogin(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Hero Content */}
        <div className="text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">VL</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Viva Leve 30+
            </h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            Transforme sua vida com <br />
            <span className="text-green-600">alimentação saudável</span>
          </h2>

          <p className="text-gray-600 text-lg max-w-md mx-auto md:mx-0">
            Descubra receitas deliciosas, monitore seu progresso e alcance seus objetivos de emagrecimento de forma saudável e sustentável.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <Utensils className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 text-sm">50+ Receitas</h3>
              <p className="text-gray-600 text-xs">Veganas, cetogênicas e low carb</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 text-sm">Acompanhamento</h3>
              <p className="text-gray-600 text-xs">Gráficos de evolução</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800 text-sm">Motivação</h3>
              <p className="text-gray-600 text-xs">Sistema TAE de conquistas</p>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-700 mb-3">🚀 Contas de demonstração:</p>
            <div className="space-y-2">
              <button
                onClick={() => quickLogin('admin@vivaleve.com', 'admin123')}
                className="w-full text-left p-2 rounded bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <span className="text-sm font-medium text-purple-700">👑 Admin</span>
                <span className="text-xs text-purple-600 ml-2">admin@vivaleve.com</span>
              </button>
              <button
                onClick={() => quickLogin('maria@email.com', '123456')}
                className="w-full text-left p-2 rounded bg-green-50 hover:bg-green-100 transition-colors"
              >
                <span className="text-sm font-medium text-green-700">⭐ Premium</span>
                <span className="text-xs text-green-600 ml-2">maria@email.com</span>
              </button>
              <button
                onClick={() => quickLogin('joao@email.com', '123456')}
                className="w-full text-left p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">🆓 Free</span>
                <span className="text-xs text-gray-600 ml-2">joao@email.com</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}
            </h3>
            <p className="text-gray-600">
              {isLogin ? 'Entre na sua conta para continuar' : 'Comece sua jornada de transformação'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Seu nome completo"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar conta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              {isLogin ? 'Não tem conta? Criar uma nova' : 'Já tem conta? Fazer login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}