'use client';

// -------------------------------------------------------------------------
// ARQUIVO: web-admin/src/app/page.tsx
// TIPO: DASHBOARD DE MONITORAMENTO (Frontend Next.js)
// ATUALIZAÇÃO: Rota da API alterada para '/sos' (Porta 4000)
// -------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Activity, Users, AlertTriangle, MapPin, 
  Battery, CheckCircle, Wifi, WifiOff 
} from 'lucide-react';

// 1. INTERFACE DE DADOS
interface Alert {
  id: string;
  latitude: number;
  longitude: number;
  batteryLevel: number;
  createdAt: string;
  resolved: boolean;
  user: {
    name: string;
    photoUrl: string;
    chronicDiseases?: string;
  };
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 2. BUSCAR ALERTAS (ROTA NOVA: /sos)
  const fetchAlerts = async () => {
    try {
      // --- MUDANÇA CRÍTICA: Rota '/sos' na porta 4000 ---
      const response = await axios.get('http://localhost:4000/sos'); 
      // --------------------------------------------------
      
      // Filtra apenas os não resolvidos
      const activeAlerts = response.data.filter((a: Alert) => !a.resolved);
      setAlerts(activeAlerts);
      setError(false);
    } catch (err) {
      console.error('Erro de conexão:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // 3. RESOLVER ALERTA (ROTA NOVA: /sos)
  const resolveAlert = async (id: string) => {
    try {
      // --- MUDANÇA CRÍTICA: Rota '/sos' na porta 4000 ---
      await axios.patch(`http://localhost:4000/sos/${id}`, { resolved: true });
      // --------------------------------------------------
      
      // Atualização Otimista (Remove da tela na hora)
      setAlerts((current) => current.filter(alert => alert.id !== id));
    } catch (err) {
      alert('Erro ao finalizar chamado. Verifique a conexão com o servidor.');
    }
  };

  // 4. ATUALIZAÇÃO AUTOMÁTICA (POLLING 3s)
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  // 5. RENDERIZAÇÃO VISUAL (Design System PGT-01)
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold shadow-cyan-200 shadow-lg">
            SCV
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">CENTRAL DE MONITORAMENTO</h1>
            <p className="text-xs text-gray-500 font-medium">Enterprise Edition • v1.0</p>
          </div>
        </div>
        
        {/* Status da Conexão */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          {error ? <WifiOff size={18} className="text-red-500" /> : <Wifi size={18} className="text-green-500" />}
          <span className={`text-sm font-bold ${error ? 'text-red-600' : 'text-green-600'}`}>
            {error ? 'OFFLINE (Tentando Porta 4000)' : 'ONLINE (Porta 4000)'}
          </span>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        
        {/* KPIs (Indicadores) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Monitorados */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Monitorados</p>
              <p className="text-2xl font-bold text-gray-900">Ativos</p>
            </div>
          </div>

          {/* Alertas Pendentes */}
          <div className={`bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 transition-all ${alerts.length > 0 ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-200'}`}>
            <div className={`p-3 rounded-lg ${alerts.length > 0 ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
              <AlertTriangle className={alerts.length > 0 ? 'text-red-600' : 'text-gray-400'} size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Alertas Pendentes</p>
              <p className={`text-2xl font-bold ${alerts.length > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {alerts.length}
              </p>
            </div>
          </div>

          {/* Status API */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Activity className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Conexão API</p>
              <p className="text-2xl font-bold text-green-600">Porta 4000</p>
            </div>
          </div>
        </div>

        {/* TÍTULO DA SEÇÃO */}
        <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <AlertTriangle size={20} className="text-gray-400" />
                Ocorrências em Tempo Real (/sos)
            </h2>
            {loading && <span className="text-sm text-gray-400 animate-pulse">Buscando dados...</span>}
        </div>

        {/* ESTADO VAZIO (SEM ALERTAS) */}
        {!loading && !error && alerts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-500" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Tudo Tranquilo</h3>
            <p className="text-gray-500 mt-2">Nenhum pedido de socorro ativo na rota SOS.</p>
          </div>
        )}

        {/* GRID DE ALERTAS (CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-xl border-2 border-red-100 shadow-lg shadow-red-100/50 overflow-hidden hover:border-red-300 transition-all group">
              
              {/* Header do Card */}
              <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-start">
                 <div className="flex items-center gap-3">
                    <img 
                      src={alert.user?.photoUrl || 'https://ui-avatars.com/api/?name=User&background=random'} 
                      alt="User" 
                      className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                        <h3 className="font-bold text-gray-900">{alert.user?.name || 'Desconhecido'}</h3>
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-1">
                            <Activity size={10} /> PÂNICO
                        </span>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-xs font-mono text-gray-500 block">Bateria</span>
                    <span className={`font-bold ${alert.batteryLevel < 20 ? 'text-red-600' : 'text-green-600'}`}>
                        {alert.batteryLevel}%
                    </span>
                 </div>
              </div>

              {/* Corpo do Card */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Activity size={16} className="text-gray-400" />
                    <span>Ocorrido {formatDistanceToNow(new Date(alert.createdAt), { locale: ptBR, addSuffix: true })}</span>
                </div>

                <div className="space-y-3">
                    {/* Link para o Mapa */}
                    <a 
                      href={`http://googleusercontent.com/maps.google.com/?q=${alert.latitude},${alert.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <MapPin size={18} />
                        Localizar no Mapa
                    </a>

                    {/* Botão Resolver */}
                    <button 
                      onClick={() => resolveAlert(alert.id)}
                      className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md shadow-green-200"
                    >
                        <CheckCircle size={18} />
                        Finalizar Atendimento
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}