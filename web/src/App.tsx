// -------------------------------------------------------------------------
// PROJETO: SAÚDE CICLO DA VIDA (ENTERPRISE EDITION)
// ARQUIVO: E:\Projetos\SaudeCicloDaVida\web\src\App.tsx
// OBJETIVO: LAYOUT TRIPLO INTEGRADO COM MÓDULO DE AUDITORIA (HISTÓRICO)
// -------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, AlertTriangle, Settings, 
  CheckCircle, Activity, User, Wifi, WifiOff, Clock 
} from 'lucide-react';

// --- INFRAESTRUTURA GEOGRÁFICA ---
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { socketService } from './services/socket';

// Fix para ícones do Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

const DashboardHome = () => {
  // PERSISTÊNCIA: Alertas Ativos
  const [alerts, setAlerts] = useState<any[]>(() => {
    const saved = localStorage.getItem('@SaudeCiclo:alerts');
    return saved ? JSON.parse(saved) : [];
  });

  // PERSISTÊNCIA: Histórico de Auditoria
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('@SaudeCiclo:history');
    return saved ? JSON.parse(saved) : [];
  });

  const [connectionStatus, setConnectionStatus] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number]>([-22.7348, -47.6476]);

  // Sincronização de Persistência Local
  useEffect(() => {
    localStorage.setItem('@SaudeCiclo:alerts', JSON.stringify(alerts));
    localStorage.setItem('@SaudeCiclo:history', JSON.stringify(history));
  }, [alerts, history]);

  useEffect(() => {
    socketService.connect();
    socketService.socket?.on('connect', () => setConnectionStatus(true));
    socketService.socket?.on('disconnect', () => setConnectionStatus(false));

    socketService.on('triggerSOS', (data) => {
      const newAlert = {
        id: Date.now().toString(),
        name: data.userName || `Usuário ${data.userId?.substring(0,4)}`, 
        battery: data.battery || '??%',
        time: new Date().toLocaleTimeString('pt-BR'),
        fullTimestamp: new Date().toISOString(), // Base para cálculo de SLA
        location: [data.location?.latitude || -22.7348, data.location?.longitude || -47.6476] as [number, number]
      };
      setAlerts(prev => [newAlert, ...prev]);
      setMapPosition(newAlert.location);
    });

    socketService.on('alertResolved', (data) => {
      setAlerts(prev => prev.filter(alert => alert.id !== data.id));
    });

    return () => {
      socketService.off('triggerSOS');
      socketService.off('alertResolved');
    };
  }, []);

  // Lógica de Cálculo de Resposta (Auditoria)
  const calculateSLA = (startTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date().getTime();
    const diffInSeconds = Math.floor((end - start) / 1000);

    if (diffInSeconds < 60) {
      return { text: `${diffInSeconds}s`, label: 'Excelente', color: '#059669', bg: '#ECFDF5' };
    }
    const mins = Math.floor(diffInSeconds / 60);
    return { text: `${mins}m ${diffInSeconds % 60}s`, label: 'Normal', color: '#D97706', bg: '#FFFBEB' };
  };

  const handleResolveAlert = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/sos/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const resolvedAlert = alerts.find(a => a.id === id);
        if (resolvedAlert) {
          const sla = calculateSLA(resolvedAlert.fullTimestamp);
          const newEntry = {
            id: resolvedAlert.id,
            name: resolvedAlert.name,
            resolvedAt: new Date().toLocaleString('pt-BR'),
            slaText: sla.text,
            slaLabel: sla.label,
            slaColor: sla.color,
            slaBg: sla.bg
          };
          setHistory(prev => [newEntry, ...prev].slice(0, 10)); // Mantém os últimos 10
        }
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      }
    } catch (error) {
      console.error("Erro ao resolver chamado:", error);
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
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Enterprise Edition • v2.5 (Audit Module)</p>
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
        height: '500px' // Altura fixa para o monitoramento superior
      }}>
        
        {/* COLUNA 1: EMERGÊNCIAS */}
        <div style={{ overflowY: 'auto' }}>
          <h3 className="section-title" style={{ color: '#DC2626' }}>
            <AlertTriangle size={20} /> Emergências Ativas ({alerts.length})
          </h3>

          {alerts.length === 0 && (
             <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', border: '2px dashed #E5E7EB', borderRadius: '12px' }}>
                <CheckCircle size={48} style={{ marginBottom: '16px', color: '#10B981', opacity: 0.5 }} />
                <p>Nenhuma emergência ativa.</p>
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
                <button className="btn btn-green" style={{ flex: 1, padding: '8px' }} onClick={() => handleResolveAlert(alert.id)}>
                    ATENDER OCORRÊNCIA
                </button>
                <button onClick={() => setMapPosition(alert.location)} style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', cursor: 'pointer' }}>
                  <MapPin size={20} color="#0891B2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* COLUNA 2: MAPA CENTRAL */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #E5E7EB', borderRadius: '16px' }}>
          <MapContainer center={mapPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ChangeView center={mapPosition} />
            {alerts.map(alert => (
              <Marker key={alert.id} position={alert.location}><Popup><b>{alert.name}</b></Popup></Marker>
            ))}
          </MapContainer>
        </div>

        {/* COLUNA 3: RASTREAMENTO */}
        <div style={{ overflowY: 'auto' }}>
          <h3 className="section-title" style={{ color: '#005F73' }}><Activity size={20} /> Rastreamento Ativo</h3>
          <div className="user-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="avatar-circle" style={{ backgroundColor: '#FEE2E2', color: '#111' }}>MS</div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Maria da Silva</h4>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Monitoramento de Rotina</div>
                </div>
              </div>
              <button onClick={() => setMapPosition([-22.7300, -47.6400])} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                <MapPin size={18} color="#0891B2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEÇÃO DE HISTÓRICO DE ATENDIMENTO (ABAIXO DO GRID) --- */}
      <div className="card" style={{ padding: '24px', border: '1px solid #E5E7EB', borderRadius: '16px' }}>
        <h3 className="section-title" style={{ color: '#374151', marginBottom: '15px' }}>
          <Clock size={20} color="#6B7280" /> Histórico de Atendimentos Recentes
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #F3F4F6', color: '#6B7280' }}>
              <th style={{ padding: '12px' }}>Paciente</th>
              <th style={{ padding: '12px' }}>Finalizado em</th>
              <th style={{ padding: '12px' }}>Tempo de Resposta</th>
              <th style={{ padding: '12px' }}>Performance</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#9CA3AF' }}>Nenhum atendimento registrado nesta sessão.</td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px', fontWeight: '600' }}>{item.name}</td>
                  <td style={{ padding: '12px' }}>{item.resolvedAt}</td>
                  <td style={{ padding: '12px' }}>{item.slaText}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      color: item.slaColor, 
                      backgroundColor: item.slaBg, 
                      padding: '4px 10px', 
                      borderRadius: '12px', 
                      fontSize: '11px', 
                      fontWeight: '800',
                      textTransform: 'uppercase'
                    }}>
                      {item.slaLabel}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- ESTRUTURA DE NAVEGAÇÃO ---
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
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>v2.5 Enterprise</span>
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
        <Routes><Route path="/" element={<DashboardHome />} /></Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (<BrowserRouter><Layout /></BrowserRouter>);
}