'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MapPin, Battery, Activity, AlertTriangle, User, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  latitude: number;
  longitude: number;
  batteryLevel: number;
  createdAt: string;
  resolved: boolean; // Novo campo importante
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

  // Busca apenas alertas NÃO RESOLVIDOS
  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/alerts');
      // Filtra no frontend para mostrar apenas os pendentes (resolved: false)
      const activeAlerts = response.data.filter((a: Alert) => !a.resolved);
      setAlerts(activeAlerts);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.error('Erro de conexão:', err);
      setError(true);
      setLoading(false);
    }
  };

  // Função para resolver o chamado
  const resolveAlert = async (id: string) => {
    try {
      // 1. Atualiza no Banco de Dados
      await axios.patch(`http://localhost:3000/alerts/${id}`, {
        resolved: true
      });
      
      // 2. Remove da tela imediatamente (Feedback visual rápido)
      setAlerts((current) => current.filter(alert => alert.id !== id));
      
    } catch (err) {
      alert('Erro ao finalizar chamado. Tente novamente.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-3 rounded-lg shadow-lg shadow-red-900/50">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">TORRE DE CONTROLE <span className="text-red-500">SOS</span></h1>
            <p className="text-slate-400 text-sm">Monitoramento de Vida Assistida • Enterprise Edition</p>
          </div>
        </div>
        
        {/* Contador de Ocorrências Ativas */}
        <div className="mt-4 md:mt-0 flex items-center gap-4">
            <div className="bg-red-900/30 border border-red-800 px-4 py-2 rounded-lg">
                <span className="text-red-400 text-xs font-bold uppercase block">Chamados Ativos</span>
                <span className="text-2xl font-bold text-white">{alerts.length}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${error ? 'bg-red-400' : 'bg-green-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${error ? 'bg-red-500' : 'bg-green-500'}`}></span>
                </span>
                <span className={`font-bold text-xs uppercase tracking-widest ${error ? 'text-red-400' : 'text-green-400'}`}>
                    {error ? 'OFFLINE' : 'ONLINE'}
                </span>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {loading && (
          <div className="text-center py-20 animate-pulse">
            <Activity className="h-10 w-10 text-slate-600 mx-auto mb-4 animate-spin" />
            <p className="text-slate-500 text-lg">Sincronizando satélites...</p>
          </div>
        )}

        {!loading && !error && alerts.length === 0 && (
          <div className="text-center py-24 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed flex flex-col items-center">
            <div className="bg-green-900/20 w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-green-900/50">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">Todas as operações normais.</h2>
            <p className="text-slate-400 mt-2">Nenhum pedido de socorro pendente.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {alerts.map((alert) => (
            <div key={alert.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              
              <div className="relative bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col h-full">
                
                {/* Cabeçalho Card */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={alert.user?.photoUrl || 'https://i.pravatar.cc/150'} 
                      alt={alert.user?.name} 
                      className="w-16 h-16 rounded-full border-2 border-slate-700 object-cover"
                    />
                    <div>
                      <h2 className="text-xl font-bold text-white leading-none mb-1">
                        {alert.user?.name || 'Desconhecido'}
                      </h2>
                      <div className="flex items-center gap-1 text-red-500 font-bold text-xs uppercase bg-red-500/10 px-2 py-1 rounded w-fit mt-1">
                        <AlertTriangle className="h-3 w-3" />
                        PÂNICO DETECTADO
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/50">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <Battery className="h-4 w-4" /> Bateria
                    </div>
                    <span className={`text-lg font-mono font-bold ${alert.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'}`}>
                      {alert.batteryLevel}%
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/50">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                      <Activity className="h-4 w-4" /> Ocorrido
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      {formatDistanceToNow(new Date(alert.createdAt), { locale: ptBR })}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="mt-auto space-y-3">
                    <a 
                    href={`http://googleusercontent.com/maps.google.com/?q=${alert.latitude},${alert.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all border border-slate-700"
                    >
                    <MapPin className="h-5 w-5" />
                    VER LOCALIZAÇÃO
                    </a>

                    <button 
                        onClick={() => resolveAlert(alert.id)}
                        className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-900/20"
                    >
                        <CheckCircle className="h-5 w-5" />
                        MARCAR COMO ATENDIDO
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