import React, { useState } from 'react';
import { calculateBMI } from '../utils/bmi';
import { Calculator, Scale, Ruler, Heart, TrendingUp } from 'lucide-react';

export default function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height) / 100; // Convert cm to meters

    if (weightNum > 0 && heightNum > 0) {
      const bmiResult = calculateBMI(weightNum, heightNum);
      setResult(bmiResult);
    }
  };

  const resetForm = () => {
    setWeight('');
    setHeight('');
    setResult(null);
  };

  const bmiRanges = [
    { range: 'Abaixo de 18.5', classification: 'Baixo peso', color: 'bg-blue-100 text-blue-800' },
    { range: '18.5 - 24.9', classification: 'Peso normal', color: 'bg-green-100 text-green-800' },
    { range: '25.0 - 29.9', classification: 'Sobrepeso', color: 'bg-yellow-100 text-yellow-800' },
    { range: '30.0 ou mais', classification: 'Obesidade', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Calculadora de IMC</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calcule seu Índice de Massa Corporal e descubra se seu peso está dentro da faixa considerada saudável. 
          Lembre-se: o IMC é apenas uma referência, consulte sempre um profissional de saúde.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Scale className="h-6 w-6 text-blue-500" />
            <span>Calcular IMC</span>
          </h2>

          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg)
              </label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="300"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ex: 70.5"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altura (cm)
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  min="50"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Ex: 170"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Calcular IMC
              </button>
              {result && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <span>Seu Resultado</span>
              </h3>

              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-gray-800">
                  {result.bmi}
                </div>
                <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${
                  result.bmi < 18.5 ? 'bg-blue-100 text-blue-800' :
                  result.bmi < 25 ? 'bg-green-100 text-green-800' :
                  result.bmi < 30 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {result.classification}
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Heart className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Mensagem Motivacional</h4>
                    <p className="text-gray-700">{result.message}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Baseado na fórmula: Peso (kg) ÷ Altura (m)²
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 text-center">
              <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Preencha os dados
              </h3>
              <p className="text-gray-500">
                Insira seu peso e altura para calcular seu IMC
              </p>
            </div>
          )}

          {/* BMI Reference Table */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Tabela de Referência</h3>
            <div className="space-y-3">
              {bmiRanges.map((range, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                  <span className="text-gray-700 font-medium">{range.range}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${range.color}`}>
                    {range.classification}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl border border-green-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Dicas Importantes</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Limitações do IMC</h4>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Não considera composição corporal</li>
              <li>• Não diferencia músculos de gordura</li>
              <li>• Pode não ser adequado para atletas</li>
              <li>• Varia com idade e sexo</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Recomendações</h4>
            <ul className="text-gray-700 space-y-1 text-sm">
              <li>• Consulte um profissional de saúde</li>
              <li>• Considere outros fatores de saúde</li>
              <li>• Foque em hábitos saudáveis</li>
              <li>• Monitore regularmente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}