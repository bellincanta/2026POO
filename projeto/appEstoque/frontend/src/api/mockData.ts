import type { Categoria, Produto, Movimentacao, Usuario } from '../types/';


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