'use client';

// -------------------------------------------------------------------------
// ARQUIVO: web-admin/src/app/login/page.tsx
// OBJETIVO: Tela de Entrada do Administrador
// -------------------------------------------------------------------------

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Conecta no Backend (Porta 4000)
      const response = await axios.post('http://localhost:4000/auth/login', {
        email,
        password
      });

      if (response.data.access_token) {
        // Salva o token (Simples por enquanto) e joga pro Dashboard
        localStorage.setItem('scv_token', response.data.access_token);
        router.push('/'); 
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Erro de conexão com o servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        
        {/* CABEÇALHO */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-cyan-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-cyan-200">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Acesso Administrativo</h1>
          <p className="text-slate-500 text-sm">Saúde Ciclo da Vida - Enterprise</p>
        </div>

        {/* FORMULÁRIO */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                placeholder="admin@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              {/* Note que aqui não temos link funcional de "Esqueci" ainda no web, apenas decorativo */}
              <span className="text-xs text-cyan-600 hover:underline cursor-pointer">Esqueceu a senha?</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* MENSAGEM DE ERRO */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-cyan-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition hover:bg-cyan-800 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Acessando...' : 'ENTRAR NO SISTEMA'}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

      </div>
    </div>
  );
}