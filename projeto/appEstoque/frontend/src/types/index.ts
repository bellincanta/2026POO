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
  categoria: Categoria; 
}

export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';

export interface Movimentacao {
  id: number;
  produto: Produto;
  tipo: TipoMovimentacao;
  quantidade: number;
  criadoEm: string; 
}