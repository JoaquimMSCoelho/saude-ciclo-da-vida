'use client';

// -------------------------------------------------------------------------
// ARQUIVO: web-admin/src/app/page.tsx
// TIPO: DASHBOARD DE MONITORAMENTO
// STATUS: FINAL (Link do Google Maps Oficializado e Testado)
// -------------------------------------------------------------------------

import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Activity, Users, AlertTriangle, MapPin, 
  CheckCircle, Wifi, WifiOff, Navigation 
} from 'lucide-react';

// 1. INTERFACES DE DADOS
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
  };
}

interface User {
  id: string;
  name: string;
  photoUrl: string;
  lastLatitude?: number;
  lastLongitude?: number;
  lastSeenAt?: string;
  role: string;
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 2. BUSCAR DADOS
  const fetchData = async () => {
    try {
      // A. Busca Alertas
      const resAlerts = await axios.get('http://localhost:4000/sos');
      const activeAlerts = resAlerts.data.filter((a: Alert) => !a.resolved);
      setAlerts(activeAlerts);

      // B. Busca Usuários
      const resUsers = await axios.get('http://localhost:4000/users');
      const trackedUsers = resUsers.data.filter((u: User) => u.lastLatitude && u.role === 'PACIENTE');
      setUsers(trackedUsers);

      setError(false);
    } catch (err) {
      console.error('Erro de conexão:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (id: string) => {
    try {
      await axios.patch(`http://localhost:4000/sos/${id}`, { resolved: true });
      fetchData(); 
    } catch (err) {
      alert('Erro ao finalizar.');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
            SCV
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">CENTRAL DE MONITORAMENTO</h1>
            <p className="text-xs text-gray-500 font-medium">Enterprise Edition • v2.4 (Maps Standard)</p>
          </div>
        </div>
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          {error ? <WifiOff size={18} className="text-red-500" /> : <Wifi size={18} className="text-green-500" />}
          <span className={`text-sm font-bold ${error ? 'text-red-600' : 'text-green-600'}`}>
            {error ? 'OFFLINE' : 'SISTEMA ONLINE'}
          </span>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ESQUERDA: ALERTAS DE PÂNICO */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-600" />
            Alertas de Emergência ({alerts.length})
          </h2>

          {alerts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
              <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
              <p className="text-gray-500">Nenhum pedido de socorro ativo.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white rounded-xl border-l-4 border-red-500 shadow-md p-6 animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img src={alert.user?.photoUrl} className="w-12 h-12 rounded-full bg-gray-200" alt="User" />
                      <div>
                        <h3 className="font-bold text-lg">{alert.user?.name}</h3>
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">SOS ATIVO</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="block font-bold text-red-600">{alert.batteryLevel}% Bateria</span>
                       <span className="text-xs text-gray-400">
                         {formatDistanceToNow(new Date(alert.createdAt), { locale: ptBR, addSuffix: true })}
                       </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* LINK CORRIGIDO PARA PADRÃO OFICIAL */}
                    <a 
                      href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <MapPin size={18} /> Ver Local
                    </a>
                    <button 
                      onClick={() => resolveAlert(alert.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Atender
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIREITA: MONITORAMENTO ATIVO */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Navigation className="text-cyan-600" />
            Rastreamento Ativo ({users.length})
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {users.length === 0 ? (
               <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
                 <Users className="text-gray-400 mx-auto mb-2" size={32} />
                 <p className="text-gray-500">Nenhum paciente com GPS ativo.</p>
               </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-cyan-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={user.photoUrl} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" alt="User" />
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Activity size={12} className="text-cyan-500" />
                          <span>
                            Visto {user.lastSeenAt ? formatDistanceToNow(new Date(user.lastSeenAt), { locale: ptBR, addSuffix: true }) : 'Recentemente'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* LINK CORRIGIDO PARA PADRÃO OFICIAL */}
                    <a 
                      href={`https://www.google.com/maps?q=${user.lastLatitude},${user.lastLongitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-cyan-50 text-cyan-700 hover:bg-cyan-100 p-3 rounded-full transition-colors"
                      title="Abrir no Mapa"
                    >
                      <MapPin size={20} />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}