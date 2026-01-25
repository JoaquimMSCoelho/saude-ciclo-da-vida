// -------------------------------------------------------------------------
// ARQUIVO: E:\Projetos\SaudeCicloDaVida\web\src\App.tsx
// OBJETIVO: DASHBOARD CONECTADO + STATUS VISUAL
// -------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, AlertTriangle, Settings, 
  CheckCircle, Activity, User, Wifi, WifiOff 
} from 'lucide-react';

import { socketService } from './services/socket';

// --- COMPONENTE CENTRAL DE MONITORAMENTO ---
const DashboardHome = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    // 1. Iniciar Conexão
    socketService.connect();

    // 2. Monitorar estado da conexão para mudar o Botão Visual
    socketService.socket?.on('connect', () => setConnectionStatus(true));
    socketService.socket?.on('disconnect', () => setConnectionStatus(false));

    // 3. OUVIR O SOS DO CELULAR
    socketService.on('triggerSOS', (data) => {
      console.log('🚨 SOS RECEBIDO:', data);
      
      const newAlert = {
        id: Date.now(),
        // Se vier nome do backend usa, senão usa genérico
        name: data.userName || `Usuário ${data.userId?.substring(0,4)}`, 
        initials: 'SOS',
        battery: data.battery || '??%',
        time: 'Agora mesmo',
        location: data.location || {}
      };

      setAlerts(prev => [newAlert, ...prev]);
    });

    return () => {
      socketService.off('triggerSOS');
    };
  }, []);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
      
      {/* HEADER ESPECÍFICO DA PÁGINA COM O BOTÃO DE STATUS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', textTransform: 'uppercase' }}>
            CENTRAL DE MONITORAMENTO
        </h2>
        
        {/* BOTÃO DE STATUS (IGUAL IMAGEM 3) */}
        <div className={`status-pill ${connectionStatus ? '' : 'offline'}`}>
            {connectionStatus ? <Wifi size={16} /> : <WifiOff size={16} />}
            {connectionStatus ? 'SISTEMA ONLINE' : 'SISTEMA OFFLINE'}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* COLUNA 1: ALERTAS */}
        <div>
          <h3 className="section-title" style={{ color: '#DC2626' }}>
            <AlertTriangle size={20} /> Alertas de Emergência ({alerts.length})
          </h3>

          {alerts.length === 0 && (
             <div style={{ padding: '30px', textAlign: 'center', color: '#9CA3AF', border: '2px dashed #E5E7EB', borderRadius: '12px' }}>
                <CheckCircle size={40} style={{ marginBottom: '10px', color: '#10B981', margin: '0 auto' }} />
                <p>Nenhuma emergência ativa no momento.</p>
             </div>
          )}
          
          {alerts.map(alert => (
            <div key={alert.id} className="user-card alert-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div className="avatar-circle" style={{ backgroundColor: '#DC2626', color: '#FFF' }}>!</div>
                  <div>
                    <h4 style={{ fontWeight: 'bold' }}>{alert.name}</h4>
                    <span className="status-badge badge-sos">SOS ATIVO</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#DC2626', fontWeight: 'bold', fontSize: '12px' }}>{alert.battery}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '11px' }}>{alert.time}</div>
                </div>
              </div>
              
              <div className="action-row">
                <button className="btn btn-gray" onClick={() => alert(`GPS: ${JSON.stringify(alert.location)}`)}>
                    <MapPin size={16} /> Ver Local
                </button>
                <button className="btn btn-green"><CheckCircle size={16} /> Atender</button>
              </div>
            </div>
          ))}
        </div>

        {/* COLUNA 2: RASTREAMENTO */}
        <div>
          <h3 className="section-title" style={{ color: '#005F73' }}>
            <MapPin size={20} /> Rastreamento Ativo
          </h3>
          {/* Card Estático de Exemplo */}
          <div className="user-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="avatar-circle" style={{ backgroundColor: '#F3E8FF', color: '#6B21A8' }}>MS</div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Maria da Silva</h4>
                  <div style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Activity size={10} /> Monitoramento de Rotina
                  </div>
                </div>
              </div>
              <button style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F0FDFA', color: '#0D9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={16} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- LAYOUT SIDEBAR ---
function Layout() {
  const [activeTab, setActiveTab] = useState('/');
  const menuItems = [
    { path: '/', label: 'Central de Monitoramento', icon: <LayoutDashboard size={20} /> },
    { path: '/pesquisas', label: 'Pesquisas', icon: <User size={20} /> },
    { path: '/bancos', label: 'Bancos', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E5E7EB', position: 'fixed', height: '100%', zIndex: 10 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #F3F4F6' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Saúde Ciclo</h1>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Enterprise Edition v2.4</span>
        </div>
        <nav style={{ padding: '20px' }}>
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setActiveTab(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '5px',
                backgroundColor: activeTab === item.path ? '#F3F4F6' : 'transparent',
                color: activeTab === item.path ? '#111827' : '#6B7280',
                fontWeight: activeTab === item.path ? '600' : '400'
              }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, marginLeft: '250px', padding: '30px' }}>
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