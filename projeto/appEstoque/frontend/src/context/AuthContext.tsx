// src/context/AuthContext.tsx
//
// O AuthContext é o que permite que QUALQUER componente da árvore React
// saiba se o usuário está logado, sem precisar passar essa informação
// manualmente por props em cada nível (isso se chama "prop drilling",
// e o Context serve exatamente para evitar esse problema).

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Usuario } from '../types';
import { authApi } from '../api/api';

interface AuthContextType {
  usuario: Usuario | null;
  logado: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

// O valor inicial é "undefined" de propósito — assim conseguimos
// detectar (no useAuth abaixo) se alguém tentou usar o contexto fora
// do <AuthProvider>, o que seria um erro de uso.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Ao carregar a página, tentamos recuperar um usuário já logado
  // anteriormente (guardado no localStorage), para não deslogar o
  // aluno toda vez que ele der F5.
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem('usuario');
    return salvo ? JSON.parse(salvo) : null;
  });

  async function login(email: string, senha: string) {
    // Chama a "API" (hoje é o mock, na Parte 4 será o Axios real).
    // Essa troca não vai exigir nenhuma mudança aqui dentro.
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

// Hook customizado: em vez de todo componente escrever
// "useContext(AuthContext)" e lidar com o "undefined", eles só chamam
// useAuth() e já recebem o valor certo (ou um erro claro, se usado fora
// do Provider).
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}