import {
  categorias,
  produtos,
  movimentacoes,
  usuariosMock,
  gerarIdCategoria,
  gerarIdProduto,
  gerarIdMovimentacao,
} from './mockData';
import type {
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