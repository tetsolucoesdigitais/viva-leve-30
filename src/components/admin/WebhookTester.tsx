import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
  CheckCircle
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

export default function WebhookTester() {
  const { user: currentUser } = useAuth();
  const [url, setUrl] = useState('https://webhook.kiwify.com.br/webhook/test');
  const [method, setMethod] = useState('POST');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer YOUR_TOKEN_HERE"\n}');
  const [payload, setPayload] = useState('{\n  "event": "order.completed",\n  "data": {\n    "order_id": "123456",\n    "customer_email": "usuario@email.com",\n    "product_id": "premium_plan",\n    "amount": 97.00,\n    "status": "paid"\n  }\n}');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Acesso Negado</h3>
        <p className="text-gray-500">Você não tem permissão para acessar esta área.</p>
      </div>
    );
  }

  const sendWebhook = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const parsedHeaders = JSON.parse(headers);
      const parsedPayload = method !== 'GET' ? JSON.parse(payload) : undefined;

      const response = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: parsedPayload ? JSON.stringify(parsedPayload) : undefined,
      });

      const responseData = await response.text();
      const duration = Date.now() - startTime;

      const newLog: WebhookLog = {
        id: Date.now().toString(),
        timestamp: new Date(),
        method,
        url,
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
        method,
        url,
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const testScenarios = [
    {
      name: 'Compra Premium - Sucesso',
      description: 'Simula uma compra bem-sucedida do plano Premium',
      url: 'https://webhook.kiwify.com.br/webhook/order/completed',
      payload: {
        event: 'order.completed',
        data: {
          order_id: 'ORD-' + Date.now(),
          customer_email: 'cliente@email.com',
          product_id: 'premium_plan_30d',
          amount: 97.00,
          status: 'paid',
          payment_method: 'credit_card'
        }
      }
    },
    {
      name: 'Upgrade de Plano',
      description: 'Simula upgrade de Free para Premium',
      url: 'https://webhook.kiwify.com.br/webhook/subscription/upgrade',
      payload: {
        event: 'subscription.upgrade',
        data: {
          user_id: 'user_123',
          old_plan: 'free',
          new_plan: 'premium',
          effective_date: new Date().toISOString()
        }
      }
    },
    {
      name: 'Pagamento Falhado',
      description: 'Simula falha no pagamento',
      url: 'https://webhook.kiwify.com.br/webhook/payment/failed',
      payload: {
        event: 'payment.failed',
        data: {
          order_id: 'ORD-FAIL-' + Date.now(),
          customer_email: 'cliente@email.com',
          reason: 'insufficient_funds',
          retry_count: 1
        }
      }
    }
  ];

  const loadTestScenario = (scenario: any) => {
    setUrl(scenario.url);
    setPayload(JSON.stringify(scenario.payload, null, 2));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
            <Webhook className="h-8 w-8 text-purple-500" />
            <span>Teste de Webhook Kiwify</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Teste integrações de pagamento e webhooks com a Kiwify
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Request Configuration */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Configurar Requisição</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método HTTP
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Webhook
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://webhook.kiwify.com.br/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headers (JSON)
                </label>
                <textarea
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                />
              </div>

              {method !== 'GET' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payload (JSON)
                  </label>
                  <textarea
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              )}

              <button
                onClick={sendWebhook}
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