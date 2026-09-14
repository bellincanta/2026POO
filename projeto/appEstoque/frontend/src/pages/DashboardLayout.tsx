// src/layouts/DashboardLayout.tsx
//
// Este componente é o "molde" comum a todas as páginas internas do
// sistema: menu lateral fixo + barra de topo com nome do usuário/logout
// + uma área central onde a página específica é desenhada (<Outlet />).

import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  display: 'block',
  padding: '10px 16px',
  textDecoration: 'none',
  color: isActive ? '#fff' : '#333',
  backgroundColor: isActive ? '#2563eb' : 'transparent',
  borderRadius: 6,
  marginBottom: 4,
});

export function DashboardLayout() {
  const { usuario, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Menu lateral */}
      <aside style={{ width: 220, borderRight: '1px solid #eee', padding: 16 }}>
        <h3 style={{ marginBottom: 24 }}>📦 Estoque</h3>
        {/* NavLink, diferente do Link comum, sabe se a rota está ativa
            e nos deixa aplicar um estilo diferente (veja "linkStyle" acima) */}
        <NavLink to="/" end style={linkStyle}>
          Início
        </NavLink>
        <NavLink to="/categorias" style={linkStyle}>
          Categorias
        </NavLink>
        <NavLink to="/produtos" style={linkStyle}>
          Produtos
        </NavLink>
        <NavLink to="/movimentacoes" style={linkStyle}>
          Movimentações
        </NavLink>
      </aside>

      {/* Área principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '12px 24px',
            borderBottom: '1px solid #eee',
          }}
        >
          <span style={{ marginRight: 12 }}>Olá, {usuario?.nome}</span>
          <button onClick={logout}>Sair</button>
        </header>

        <main style={{ padding: 24, flex: 1 }}>
          {/* Aqui o React Router desenha a página correspondente à rota
              atual: DashboardHome, CategoriasPage, ProdutosPage ou
              MovimentacoesPage (definidas no App.tsx, seção 2.15). */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}