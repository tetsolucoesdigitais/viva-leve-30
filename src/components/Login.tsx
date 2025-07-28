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

          {/* Plans Comparison */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Escolha seu Plano</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Free Plan */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-center mb-3">
                  <h4 className="font-bold text-gray-800">Plano Free</h4>
                  <p className="text-2xl font-bold text-gray-600">Grátis</p>
                  <p className="text-sm text-gray-500">5 dias de acesso</p>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ 10 receitas selecionadas</li>
                  <li>✅ Calculadora de IMC</li>
                  <li>✅ Registro de peso básico</li>
                  <li>✅ Sistema TAE de conquistas</li>
                  <li>❌ Vídeos de exercícios</li>
                  <li>❌ Receitas premium</li>
                </ul>
              </div>

              {/* Premium Plan */}
              <div className="border-2 border-green-500 rounded-lg p-4 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    RECOMENDADO
                  </span>
                </div>
                <div className="text-center mb-3">
                  <h4 className="font-bold text-gray-800">Plano Premium</h4>
                  <p className="text-2xl font-bold text-green-600">R$ 19,99</p>
                  <p className="text-sm text-gray-500">30 dias de acesso</p>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ 50+ receitas completas</li>
                  <li>✅ Calculadora de IMC avançada</li>
                  <li>✅ Gráficos de evolução</li>
                  <li>✅ Sistema TAE completo</li>
                  <li>✅ Vídeos de exercícios</li>
                  <li>✅ Suporte nutricional</li>
                  <li>✅ Atualizações semanais</li>
                </ul>
              </div>
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