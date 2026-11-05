// src/pages/MovimentacoesPage.tsx
//
// Página "container": ela busca os dados e coordena a lista + o
// formulário. Os componentes filhos (ListaMovimentacoes, FormularioMovimentacao)
// continuam "burros" — só recebem props e emitem eventos.

import { useEffect, useState } from 'react';
import { type Movimentacao, type Produto } from '../types';
import { movimentacaoApi, produtoApi } from '../api/api';
import { ListaMovimentacoes } from '../components/ListaMovimentacoes';
import { FormularioMovimentacao } from '../components/FormularioMovimentacao';

export function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  async function carregar() {
    setMovimentacoes(await movimentacaoApi.listar());
    setProdutos(await produtoApi.listar());
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h2>Movimentações</h2>
      <ListaMovimentacoes movimentacoes={movimentacoes} />
      <hr />
      <FormularioMovimentacao produtos={produtos} onMovimentacaoCriada={carregar} />
    </div>
  );
}
