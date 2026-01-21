'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Componente interno para ler a URL (Next.js pede Suspense para useSearchParams)
function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token'); // Pega o token da URL

  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ msg: '', type: '' });

  const handleReset = async () => {
    if (pass !== confirm) {
      setStatus({ msg: 'As senhas não coincidem!', type: 'error' });
      return;
    }
    if (!token) {
      setStatus({ msg: 'Token inválido (Link quebrado).', type: 'error' });
      return;
    }

    try {
      setStatus({ msg: 'Processando...', type: 'info' });
      
      // Chama o Backend na porta 4000
      const response = await fetch('http://localhost:4000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPass: pass }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ msg: 'Sucesso! Redirecionando...', type: 'success' });
        setTimeout(() => router.push('/login'), 3000); // Manda pro login
      } else {
        setStatus({ msg: data.message || 'Erro ao alterar.', type: 'error' });
      }
    } catch (err) {
      setStatus({ msg: 'Erro de conexão com o servidor.', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <h1 className="text-2xl font-bold text-slate-800 text-center">Nova Senha</h1>
      <p className="text-slate-500 text-center mb-4">Digite sua nova senha de acesso.</p>

      <input
        type="password"
        placeholder="Nova Senha"
        className="p-3 border rounded-lg"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Confirmar Nova Senha"
        className="p-3 border rounded-lg"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button
        onClick={handleReset}
        className="bg-cyan-600 text-white p-3 rounded-lg font-bold hover:bg-cyan-700 transition"
      >
        SALVAR NOVA SENHA
      </button>

      {status.msg && (
        <div className={`p-3 rounded text-center font-medium ${
          status.type === 'error' ? 'bg-red-100 text-red-700' : 
          status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {status.msg}
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Suspense fallback={<div>Carregando...</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}