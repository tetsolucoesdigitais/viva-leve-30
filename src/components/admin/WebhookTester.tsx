import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { users } from '../../data/users';
import { 
  Webhook, 
  Send, 
  Check, 
  X, 
  Clock, 
  Shield,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink
} from 'lucide-react';

interface WebhookLog {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  status: number;
  response: any;
  duration: number;
}

interface WebhookSimulation {
  email: string;
  evento: string;
  produto: string;
}

export default function WebhookTester() {
  const { user: currentUser } = useAuth();
  const [webhookUrl] = useState(`${window.location.origin}/api/webhooks/kiwify`);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [simulation, setSimulation] = useState<WebhookSimulation>({
    email: '',
    evento: 'assinatura renovada',
    produto: 'Plano Premium'
  });

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Acesso Negado</h3>
        <p className="text-gray-500">Você não tem permissão para acessar esta área.</p>
      </div>
    );
  }

  const simulateWebhook = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const payload = {
        email: simulation.email,
        evento: simulation.evento,
        produto: simulation.produto,
        token: 'y61mvnkwtpb'
      };

      // Simulate the webhook processing locally
      const user = users.find(u => u.email === simulation.email);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Update user plan based on event
      let newPlan = 'free';
      let newExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      if (['assinatura renovada', 'assinatura aprovada', 'compra aprovada'].includes(simulation.evento)) {
        newPlan = 'premium';
        newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }

      // Update user in memory (in a real app, this would update the database)
      user.plan = newPlan as 'free' | 'premium';
      user.planExpiry = newExpiry;

      const duration = Date.now() - startTime;
      const responseData = {
        success: true,
        message: 'Webhook processado com sucesso',
        user_updated: true,
        new_plan: newPlan,
        new_expiry: newExpiry.toISOString()
      };

      const newLog: WebhookLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        method: 'POST',
        url: webhookUrl,
        status: 200,
        response: JSON.stringify(responseData, null, 2),
        duration
      };

      setLogs(prev => [newLog, ...prev]);
      setSelectedLog(newLog);

    } catch (error) {
      const duration = Date.now() - startTime;
      const newLog: WebhookLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        method: 'POST',
        url: webhookUrl,
        status: 400,
        response: JSON.stringify({ error: error.message }, null, 2),
        duration
      };

      setLogs(prev => [newLog, ...prev]);
      setSelectedLog(newLog);
    } finally {
      setLoading(false);
    }
  };

  const testRealWebhook = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const payload = {
        email: simulation.email,
        evento: simulation.evento,
        produto: simulation.produto,
        token: 'y61mvnkwtpb'
      };

      const response = await fetch('/api/webhooks/kiwify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.text();
      const duration = Date.now() - startTime;

      const newLog: WebhookLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        method: 'POST',
        url: webhookUrl,
        status: response.status,
        response: responseData,
        duration
      };

      setLogs(prev => [newLog, ...prev]);
      setSelectedLog(newLog);
    } catch (error) {
      const duration = Date.now() - startTime;
      const newLog: WebhookLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        method: 'POST',
        url: webhookUrl,
        status: 0,
        response: error.message,
        duration
      };

      setLogs(prev => [newLog, ...prev]);
      setSelectedLog(newLog);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-100';
    if (status >= 400 && status < 500) return 'text-yellow-600 bg-yellow-100';
    if (status >= 500) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const eventOptions = [
    'assinatura cancelada',
    'assinatura renovada', 
    'assinatura atrasada',
    'compra aprovada'
  ];

  const productOptions = [
    'Plano Premium'
  ];

  const quickScenarios = [
    {
      name: 'Compra Aprovada',
      email: 'maria@email.com',
      evento: 'compra aprovada',
      produto: 'Plano Premium'
    },
    {
      name: 'Renovação de Assinatura',
      email: 'joao@email.com',
      evento: 'assinatura renovada',
      produto: 'Plano Premium'
    },
    {
      name: 'Cancelamento',
      email: 'maria@email.com',
      evento: 'assinatura cancelada',
      produto: 'Plano Premium'
    }
  ];

  const loadQuickScenario = (scenario: any) => {
    setSimulation({
      email: scenario.email,
      evento: scenario.evento,
      produto: scenario.produto
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
            <Webhook className="h-8 w-8 text-purple-500" />
            <span>Integração Webhook Kiwify</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Sistema automatizado de atualização de planos via webhooks da Kiwify
          </p>
        </div>
        <button
          onClick={() => setLogs([])}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Limpar Logs</span>
        </button>
      </div>

      {/* Webhook URL Display */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <ExternalLink className="h-5 w-5" />
          <span>URL do Webhook para Kiwify</span>
        </h3>
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <div className="flex items-center justify-between">
            <code className="text-sm text-gray-800 font-mono break-all">{webhookUrl}</code>
            <button
              onClick={() => copyToClipboard(webhookUrl)}
              className="ml-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Token de Segurança:</strong> <code className="bg-gray-100 px-2 py-1 rounded">y61mvnkwtpb</code></p>
          <p><strong>Eventos para configurar na Kiwify:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Assinatura cancelada</li>
            <li>Assinatura renovada</li>
            <li>Assinatura atrasada</li>
            <li>Compra Aprovada</li>
          </ul>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Webhook Simulator */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Simulador de Webhooks</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email do Usuário</label>
                <input
                  type="email"
                  value={simulation.email}
                  onChange={(e) => setSimulation(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="usuario@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Evento</label>
                <select
                  value={simulation.evento}
                  onChange={(e) => setSimulation(prev => ({ ...prev, evento: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                >
                  {eventOptions.map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
                <select
                  value={simulation.produto}
                  onChange={(e) => setSimulation(prev => ({ ...prev, produto: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {productOptions.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={simulateWebhook}
                  disabled={loading || !simulation.email}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Simular Webhook</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Scenarios */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cenários Rápidos</h3>
            <div className="space-y-3">
              {quickScenarios.map((scenario, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{scenario.name}</h4>
                      <p className="text-sm text-gray-600">{scenario.email} - {scenario.evento}</p>
                    </div>
                    <button
                      onClick={() => loadQuickScenario(scenario)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      Usar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response and Logs */}
        <div className="space-y-6">
          {/* Current Response */}
          {selectedLog && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Resultado</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedLog.status)}`}>
                    {selectedLog.status === 0 ? 'ERRO' : selectedLog.status}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedLog.duration}ms</span>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Resposta</label>
                    <button
                      onClick={() => copyToClipboard(selectedLog.response)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {typeof selectedLog.response === 'string' 
                        ? selectedLog.response 
                        : JSON.stringify(selectedLog.response, null, 2)
                      }
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Webhook Logs */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Últimos 10 Eventos Processados</h3>
            
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <Webhook className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum evento processado ainda</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Data/Hora</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Email</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Evento</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.slice(0, 10).map((log) => (
                      <tr 
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedLog?.id === log.id ? 'bg-purple-50' : ''
                        }`}
                      >
                        <td className="py-2 px-3">
                          {log.timestamp.toLocaleString('pt-BR')}
                        </td>
                        <td className="py-2 px-3 font-mono text-xs">
                          {log.url.includes('email=') ? 
                            new URLSearchParams(log.url.split('?')[1])?.get('email') || 'N/A' : 
                            'Simulação'
                          }
                        </td>
                        <td className="py-2 px-3">
                          Webhook Test
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                              {log.status === 0 ? 'ERR' : log.status}
                            </span>
                            {log.status >= 200 && log.status < 300 ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Como Configurar na Kiwify</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">1. Acesse o Painel da Kiwify</h4>
            <p className="text-sm text-gray-700 mb-3">
              Vá em <strong>Configurações → Webhooks</strong>
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-2">2. Configure a URL</h4>
            <p className="text-sm text-gray-700 mb-3">
              Cole a URL do webhook mostrada acima
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">3. Configure o Token</h4>
            <p className="text-sm text-gray-700 mb-3">
              Use o token: <code className="bg-gray-100 px-2 py-1 rounded">y61mvnkwtpb</code>
            </p>
            
            <h4 className="font-semibold text-gray-800 mb-2">4. Ative os Eventos</h4>
            <p className="text-sm text-gray-700">
              Marque todos os eventos listados acima
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Enviar Requisição</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Test Scenarios */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cenários de Teste</h3>
            <div className="space-y-3">
              {testScenarios.map((scenario, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{scenario.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                    </div>
                    <button
                      onClick={() => loadTestScenario(scenario)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Usar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Response and Logs */}
        <div className="space-y-6">
          {/* Current Response */}
          {selectedLog && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Resposta</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedLog.status)}`}>
                    {selectedLog.status === 0 ? 'ERRO' : selectedLog.status}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedLog.duration}ms</span>
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Resposta</label>
                    <button
                      onClick={() => copyToClipboard(selectedLog.response)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                      {typeof selectedLog.response === 'string' 
                        ? selectedLog.response 
                        : JSON.stringify(selectedLog.response, null, 2)
                      }
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logs History */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Requisições</h3>
            
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <Webhook className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma requisição enviada ainda</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedLog?.id === log.id 
                        ? 'border-purple-300 bg-purple-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-sm font-semibold text-gray-600">
                          {log.method}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status === 0 ? 'ERR' : log.status}
                        </span>
                        {log.status >= 200 && log.status < 300 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-2">
                        <span>{log.duration}ms</span>
                        <span>•</span>
                        <span>{log.timestamp.toLocaleTimeString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 truncate">{log.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Documentação da Integração</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Eventos Principais</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <code>order.completed</code> - Pedido finalizado</li>
              <li>• <code>payment.approved</code> - Pagamento aprovado</li>
              <li>• <code>subscription.created</code> - Assinatura criada</li>
              <li>• <code>subscription.cancelled</code> - Assinatura cancelada</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Headers Obrigatórios</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <code>Content-Type: application/json</code></li>
              <li>• <code>Authorization: Bearer TOKEN</code></li>
              <li>• <code>X-Kw-Signature</code> (para validação)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}