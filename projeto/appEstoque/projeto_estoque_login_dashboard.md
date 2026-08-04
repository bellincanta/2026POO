# Projeto Prático: Sistema de Controle de Estoque
### Stack: React + Vite + TypeScript / NestJS / PostgreSQL

---

## 1. Ordem de construção deste projeto

1. **Tela de Login** (com dados mockados)
2. **Dashboard** (layout com menu lateral + tela inicial com indicadores)
3. **Telas internas do dashboard**: Categorias → Produtos → Movimentações
4. **Backend NestJS** (Auth/Users + Categorias + Produtos + Movimentações)
5. **Integração final**, trocando o mock pela API real

As funções de acesso a dados (`authApi`, `categoriaApi`, `produtoApi`, `movimentacaoApi`) terão sempre a mesma assinatura no mock e na versão real. Isso vale também para o `AuthContext`, que já nasce pronto para funcionar com token JWT de verdade, mesmo usando dados falsos por enquanto.

---

## 2. PARTE 1 — Front-end com dados mockados

### 2.1 Criando o projeto

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install axios react-router-dom
```

> Instalamos o `react-router-dom` desde já porque o dashboard vai ter várias "páginas" (Categorias, Produtos, Movimentações) navegáveis por menu lateral — isso exige um sistema de rotas.

### 2.2 Estrutura de pastas

```
frontend/src/
├── api/
│   ├── mockData.ts
│   └── api.ts
├── types/
│   └── index.ts
├── context/
│   └── AuthContext.tsx
├── routes/
│   └── ProtectedRoute.tsx
├── layouts/
│   └── DashboardLayout.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardHome.tsx
│   ├── CategoriasPage.tsx
│   ├── ProdutosPage.tsx
│   └── MovimentacoesPage.tsx
├── components/
│   ├── ListaCategorias.tsx
│   ├── FormularioCategoria.tsx
│   ├── ListaProdutos.tsx
│   ├── FormularioProduto.tsx
│   ├── ListaMovimentacoes.tsx
│   └── FormularioMovimentacao.tsx
├── App.tsx
└── main.tsx
```

### 2.3 Tipos compartilhados (comentado)

```typescript
//src/types/index.ts

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}


export interface LoginResponse {
  accessToken: string;
  usuario: Usuario;
}

export interface Categoria {
  id: number;
  nome: string;
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}


export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';

export interface Movimentacao {
  id: number;
  produto: Produto;
  tipo: TipoMovimentacao;
  quantidade: number;
  criadoEm: string; 
}
```

### 2.4 Dados mockados (comentado)

```typescript
//src/api/mockData.ts

import { Categoria, Produto, Movimentacao, Usuario } from '../types';

export const usuariosMock: (Usuario & { senha: string })[] = [
  { id: 1, nome: 'Professor Nelson', email: 'professor@ifpr.edu.br', senha: '123456' },
];

export let categorias: Categoria[] = [
  { id: 1, nome: 'Bebidas' },
  { id: 2, nome: 'Limpeza' },
];

export let produtos: Produto[] = [
  { id: 1, nome: 'Refrigerante 2L', preco: 8.5, quantidade: 20, categoria: categorias[0] },
  { id: 2, nome: 'Detergente', preco: 3.2, quantidade: 5, categoria: categorias[1] },
];

export let movimentacoes: Movimentacao[] = [];

export let proximoIdCategoria = 3;
export let proximoIdProduto = 3;
export let proximoIdMovimentacao = 1;

export function gerarIdCategoria() {
  return proximoIdCategoria++;
}
export function gerarIdProduto() {
  return proximoIdProduto++;
}
export function gerarIdMovimentacao() {
  return proximoIdMovimentacao++;
}
```

### 2.5 Camada de API — versão MOCK, incluindo autenticação (comentada)

```typescript
//src/api/api.ts

import {
  categorias,
  produtos,
  movimentacoes,
  usuariosMock,
  gerarIdCategoria,
  gerarIdProduto,
  gerarIdMovimentacao,
} from './mockData';
import {
  Categoria,
  Produto,
  Movimentacao,
  TipoMovimentacao,
  LoginResponse,
} from '../types';

function simularDelay<T>(valor: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), 300));
}


export const authApi = {
  login: (email: string, senha: string): Promise<LoginResponse> => {
    const usuario = usuariosMock.find((u) => u.email === email);

    if (!usuario || usuario.senha !== senha) {
      
      return Promise.reject({
        response: { data: { message: 'E-mail ou senha inválidos' } },
      });
    }

    const tokenFalso = `mock-token-${usuario.id}-${Date.now()}`;

    return simularDelay({
      accessToken: tokenFalso,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  },
};

export const categoriaApi = {
  listar: (): Promise<Categoria[]> => simularDelay([...categorias]),

  criar: (nome: string): Promise<Categoria> => {
    const nova: Categoria = { id: gerarIdCategoria(), nome };
    categorias.push(nova);
    return simularDelay(nova);
  },
};

export const produtoApi = {
  listar: (): Promise<Produto[]> => simularDelay([...produtos]),

  criar: (dados: {
    nome: string;
    preco: number;
    quantidade: number;
    categoriaId: number;
  }): Promise<Produto> => {
    const categoria = categorias.find((c) => c.id === dados.categoriaId);
    if (!categoria) {
      return Promise.reject({
        response: { data: { message: `Categoria ${dados.categoriaId} não encontrada` } },
      });
    }

    const novoProduto: Produto = {
      id: gerarIdProduto(),
      nome: dados.nome,
      preco: dados.preco,
      quantidade: dados.quantidade,
      categoria,
    };
    produtos.push(novoProduto);
    return simularDelay(novoProduto);
  },
};

export const movimentacaoApi = {
  listar: (): Promise<Movimentacao[]> => {
    
    const ordenadas = [...movimentacoes].sort((a, b) => (a.criadoEm < b.criadoEm ? 1 : -1));
    return simularDelay(ordenadas);
  },

  criar: (dados: {
    produtoId: number;
    tipo: TipoMovimentacao;
    quantidade: number;
  }): Promise<Movimentacao> => {
    const produto = produtos.find((p) => p.id === dados.produtoId);
    if (!produto) {
      return Promise.reject({
        response: { data: { message: `Produto ${dados.produtoId} não encontrado` } },
      });
    }

    
    if (dados.tipo === 'SAIDA' && produto.quantidade < dados.quantidade) {
      return Promise.reject({
        response: {
          data: {
            message: `Estoque insuficiente. Disponível: ${produto.quantidade}, solicitado: ${dados.quantidade}`,
          },
        },
      });
    }

    produto.quantidade += dados.tipo === 'ENTRADA' ? dados.quantidade : -dados.quantidade;

    const novaMovimentacao: Movimentacao = {
      id: gerarIdMovimentacao(),
      produto,
      tipo: dados.tipo,
      quantidade: dados.quantidade,
      criadoEm: new Date().toISOString(),
    };
    movimentacoes.push(novaMovimentacao);

    return simularDelay(novaMovimentacao);
  },
};
```

### 2.6 Contexto de Autenticação (comentado)

```tsx
//src/context/AuthContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario } from '../types';
import { authApi } from '../api/api';

interface AuthContextType {
  usuario: Usuario | null;
  logado: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  async function login(email: string, senha: string) {
    
    const resposta = await authApi.login(email, senha);
    localStorage.setItem('accessToken', resposta.accessToken);
    localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
    setUsuario(resposta.usuario);
  }

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, logado: !!usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
```

### 2.7 Rota Protegida (comentada)

```tsx
//src/routes/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { logado } = useAuth();

  if (!logado) {
    
    return <Navigate to="/login" replace />;
  }

  
  return <Outlet />;
}
```

### 2.8 Tela de Login (comentada)

```tsx
//src/pages/LoginPage.tsx

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
```