// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// ARQUIVO: E:\Projetos\SaudeCicloDaVida\web\src\App.tsx
// OBJETIVO: LAYOUT TRIPLO COM PERSISTÊNCIA E NAVEGAÇÃO GEOGRÁFICA ATIVA
// -------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, AlertTriangle, Settings, 
  CheckCircle, Activity, User, Wifi, WifiOff 
} from 'lucide-react';

// --- INFRAESTRUTURA GEOGRÁFICA ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { socketService } from './services/socket';

// Fix para ícones do Leaflet (Correção técnica para React)
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Sub-componente para centralizar o mapa automaticamente com efeito reativo
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

// --- COMPONENTE: PAINEL DASHBOARD ---
const DashboardHome = () => {
  // PERSISTÊNCIA: Carrega do armazenamento local ao iniciar para não perder no F5
  const [alerts, setAlerts] = useState<any[]>(() => {
    const saved = localStorage.getItem('@SaudeCiclo:alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [connectionStatus, setConnectionStatus] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number]>([-22.7348, -47.6476]);

  // Salva no LocalStorage sempre que a lista de alertas for modificada
  useEffect(() => {
    localStorage.setItem('@SaudeCiclo:alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    // 1. Iniciar Conexão
    socketService.connect();

    // 2. Monitorar estado da conexão
    socketService.socket?.on('connect', () => setConnectionStatus(true));
    socketService.socket?.on('disconnect', () => setConnectionStatus(false));

    // 3. Ouvir SOS em Tempo Real
    socketService.on('triggerSOS', (data) => {
      const newAlert = {
        id: Date.now().toString(), // ID único string para persistência e remoção
        name: data.userName || `Usuário ${data.userId?.substring(0,4)}`, 
        battery: data.battery || '??%',
        time: 'Agora mesmo',
        location: [data.location?.latitude || -22.7348, data.location?.longitude || -47.6476] as [number, number]
      };
      setAlerts(prev => [newAlert, ...prev]);
      setMapPosition(newAlert.location);
    });

    // 4. Ouvir Resolução Global (Sincronia entre terminais)
    socketService.on('alertResolved', (data) => {
      setAlerts(prev => prev.filter(alert => alert.id !== data.id));
    });

    return () => {
      socketService.off('triggerSOS');
      socketService.off('alertResolved');
    };
  }, []);

  // FUNÇÃO DE RESOLUÇÃO: Comunica ao Backend e atualiza localmente
  const handleResolveAlert = async (id: string) => {
    try {
      // 1. Avisa o Backend que estamos atendendo (PATCH)
      const response = await fetch(`http://localhost:4000/sos/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // 2. Remove da tela local após confirmação
        setAlerts(prev => prev.filter(alert => alert.id !== id));
        console.log(`✔ Chamado ${id} encerrado oficialmente.`);
      }
    } catch (error) {
      console.error("Erro ao resolver chamado no servidor:", error);
      // Fallback: Remove localmente se o servidor estiver inacessível
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* HEADER SUPERIOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', textTransform: 'uppercase' }}>
            CENTRAL DE MONITORAMENTO
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Enterprise Edition • v2.4 (Maps Standard)</p>
        </div>
        
        <div className={`status-pill ${connectionStatus ? '' : 'offline'}`}>
            {connectionStatus ? <Wifi size={16} /> : <WifiOff size={16} />}
            {connectionStatus ? 'SISTEMA ONLINE' : 'SISTEMA OFFLINE'}
        </div>
      </div>

      {/* --- GRID TRIPLO INTEGRADO --- */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '380px 1fr 380px', 
        gap: '24px', 
        height: 'calc(100vh - 200px)' 
      }}>
        
        {/* COLUNA 1: ALERTAS DE EMERGÊNCIA */}
        <div style={{ overflowY: 'auto' }}>
          <h3 className="section-title" style={{ color: '#DC2626' }}>
            <AlertTriangle size={20} /> Alertas de Emergência ({alerts.length})
          </h3>

          {alerts.length === 0 && (
             <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', border: '2px dashed #E5E7EB', borderRadius: '12px' }}>
                <CheckCircle size={48} style={{ marginBottom: '16px', color: '#10B981', opacity: 0.5 }} />
                <p>Nenhuma emergência ativa no momento.</p>
             </div>
          )}
          
          {alerts.map(alert => (
            <div key={alert.id} className="user-card alert-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="avatar-circle" style={{ backgroundColor: '#DC2626', color: '#FFF' }}>!</div>
                  <div>
                    <h4 style={{ fontWeight: '700' }}>{alert.name}</h4>
                    <span className="status-badge badge-sos">SOS ATIVO</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#DC2626', fontWeight: 'bold', fontSize: '12px' }}>{alert.battery}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '11px' }}>{alert.time}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button 
                  className="btn btn-green" 
                  style={{ flex: 1, padding: '8px' }}
                  onClick={() => handleResolveAlert(alert.id)}
                >
                    ATENDER OCORRÊNCIA
                </button>
                <button 
                  onClick={() => setMapPosition(alert.location)}
                  style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', cursor: 'pointer' }}
                >
                  <MapPin size={20} color="#0891B2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* COLUNA 2: MAPA CENTRAL (VISUALIZADOR GEOGRÁFICO) */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #E5E7EB', borderRadius: '16px' }}>
          <MapContainer center={mapPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView center={mapPosition} />
            {alerts.map(alert => (
              <Marker key={alert.id} position={alert.location}>
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <strong>{alert.name}</strong> <br />
                    Bateria: {alert.battery} <br />
                    <button style={{ background: '#DC2626', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', marginTop: '8px', cursor: 'pointer' }}>
                        Despachar Resgate
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* COLUNA 3: RASTREAMENTO ATIVO (ROTINA MONITORADA) */}
        <div style={{ overflowY: 'auto' }}>
          <h3 className="section-title" style={{ color: '#005F73' }}>
            <Activity size={20} /> Rastreamento Ativo
          </h3>
          
          <div className="user-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <div className="avatar-circle" style={{ backgroundColor: '#FEE2E2', color: '#111' }}>MS</div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '50%', border: '2px solid white' }}></div>
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Maria da Silva</h4>
                  <div style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={12} color="#06B6D4" /> Visto há cerca de 16 horas
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setMapPosition([-22.7300, -47.6400])}
                style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
              >
                <MapPin size={18} color="#0891B2" />
              </button>
            </div>
          </div>

          <div className="user-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <div className="avatar-circle" style={{ backgroundColor: '#CFFAFE', color: '#111' }}>JC</div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', backgroundColor: '#10B981', borderRadius: '50%', border: '2px solid white' }}></div>
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Joaquim Mario Soares</h4>
                  <div style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={12} color="#06B6D4" /> Visto há cerca de 2 horas
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setMapPosition([-22.7348, -47.6476])}
                style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}
              >
                <MapPin size={18} color="#0891B2" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- ESTRUTURA DE NAVEGAÇÃO (LAYOUT MESTRE) ---
function Layout() {
  const menuItems = [
    { path: '/', label: 'Monitoramento', icon: <LayoutDashboard size={20} /> },
    { path: '/pesquisas', label: 'Pesquisas', icon: <User size={20} /> },
    { path: '/bancos', label: 'Bancos', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <aside style={{ width: '250px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E5E7EB', position: 'fixed', height: '100%', zIndex: 1000 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #F3F4F6' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>Saúde Ciclo</h1>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>v2.4 Enterprise</span>
        </div>
        <nav style={{ padding: '20px' }}>
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', color: '#4B5563', textDecoration: 'none', marginBottom: '4px' }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, marginLeft: '250px', padding: '32px' }}>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}