// src/pages/LoginPage.tsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await login(email, senha);
      
      navigate('/', { replace: true });
    } catch (err: any) {
      setErro(err.response?.data?.message ?? 'Erro ao fazer login');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 360,
        margin: '80px auto',
        padding: 24,
        border: '1px solid #ccc',
        borderRadius: 8,
        fontFamily: 'sans-serif',
      }}
    >
      <h2>Controle de Estoque</h2>
      <p style={{ color: '#666', marginTop: -8 }}>Entre com suas credenciais</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ width: '100%', padding: 8 }}
            required
          />
        </div>
        {erro && <p style={{ color: 'red' }}>{erro}</p>}
        <button type="submit" disabled={carregando} style={{ width: '100%', padding: 10 }}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Dica visível só para fins didáticos, pode remover depois */}
      <p style={{ fontSize: 12, color: '#999', marginTop: 16 }}>
        Use professor@ifpr.edu.br / 123456 (usuário mockado)
      </p>
    </div>
  );
}
