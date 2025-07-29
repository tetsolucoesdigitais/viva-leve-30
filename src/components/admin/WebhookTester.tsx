import React, { useState } from 'react';
import { Send, Clock, CheckCircle, XCircle, Copy } from 'lucide-react';

interface WebhookLog {
  id: string;
  email: string;
  evento: string;
  created_at: string;
  plano_aplicado?: string;
}

export default function WebhookTester() {
  const [email, setEmail] = useState('');
  const [evento, setEvento] = useState('compra_aprovada');
  const [produto, setProduto] = useState('Premium');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [message, setMessage] = useState('');

  const webhookUrl = `${window.location.origin}/api/webhooks/kiwify`;

  const handleSimulate = async () => {
    if (!email) {
      setMessage('Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/webhooks/kiwify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          evento,
          produto,
          token: 'y61mvnkwtpb'
        }),
      });

      if (response.ok) {
        setMessage('✅ Webhook simulado com sucesso!');
        loadLogs();
        setEmail('');
      } else {
        const error = await response.text();
        setMessage(`❌ Erro: ${error}`);
      }
    } catch (error) {
      setMessage(`❌ Erro de conexão: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLogs = async () => {
    try {
      // Simular logs para demonstração
      const mockLogs: WebhookLog[] = [
        {
          id: '1',
          email: 'usuario@exemplo.com',
          evento: 'compra_aprovada',
          created_at: new Date().toISOString(),
          plano_aplicado: 'Premium'
        }
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setMessage('✅ URL copiada para a área de transferência!');
  };

  const quickScenarios = [
    { name: 'Compra Aprovada', email: 'novo@cliente.com', evento: 'compra_aprovada' },
    { name: 'Assinatura Cancelada', email: 'cancelado@cliente.com', evento: 'assinatura_cancelada' },
    { name: 'Assinatura Renovada', email: 'renovado@cliente.com', evento: 'assinatura_renovada' },
  ];

  React.useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Send className="mr-2 text-green-600" />
          Simulador de Webhooks Kiwify
        </h2>

        {/* URL do Webhook */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">URL do Webhook:</h3>
          <div className="flex items-center space-x-2">
            <code className="flex-1 p-2 bg-white border rounded text-sm font-mono">
              {webhookUrl}
            </code>
            <button
              onClick={copyWebhookUrl}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copiar
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Configure esta URL no painel da Kiwify em <strong>Configurações → Webhooks</strong>
            <br />
            Token: <code className="bg-gray-200 px-1 rounded">y61mvnkwtpb</code>
          </p>
        </div>

        {/* Cenários Rápidos */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Cenários Rápidos:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickScenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => {
                  setEmail(scenario.email);
                  setEvento(scenario.evento);
                }}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="font-medium text-gray-800">{scenario.name}</div>
                <div className="text-sm text-gray-600">{scenario.email}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulário de Simulação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email do Cliente
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="cliente@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evento
            </label>
            <select
              value={evento}
              onChange={(e) => setEvento(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="compra_aprovada">Compra Aprovada</option>
              <option value="assinatura_renovada">Assinatura Renovada</option>
              <option value="assinatura_cancelada">Assinatura Cancelada</option>
              <option value="assinatura_atrasada">Assinatura Atrasada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto
            </label>
            <select
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Premium">Plano Premium</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Clock className="animate-spin w-4 h-4 mr-2" />
              Processando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Simular Webhook
            </>
          )}
        </button>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Logs de Eventos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Clock className="mr-2 text-blue-600" />
          Últimos Eventos Processados
        </h3>

        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhum evento processado ainda
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Data/Hora
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Evento
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Plano Aplicado
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {log.email}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        log.evento.includes('aprovada') || log.evento.includes('renovada')
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.evento.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {log.plano_aplicado || 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instruções de Configuração */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          📋 Como Configurar na Kiwify
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>Acesse o painel da Kiwify</li>
          <li>Vá em <strong>Configurações → Webhooks</strong></li>
          <li>Cole a URL: <code className="bg-blue-100 px-1 rounded">{webhookUrl}</code></li>
          <li>Token: <code className="bg-blue-100 px-1 rounded">y61mvnkwtpb</code></li>
          <li>Ative os eventos:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Compra Aprovada</li>
              <li>Assinatura Renovada</li>
              <li>Assinatura Cancelada</li>
              <li>Assinatura Atrasada</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}