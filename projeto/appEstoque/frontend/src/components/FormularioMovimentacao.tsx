// src/components/FormularioMovimentacao.tsx
import { useState } from 'react';
import { movimentacaoApi } from '../api/api';
import { type Produto, type TipoMovimentacao } from '../types';

interface Props {
  produtos: Produto[];
  onMovimentacaoCriada: () => void;
}

export function FormularioMovimentacao({ produtos, onMovimentacaoCriada }: Props) {
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState<TipoMovimentacao>('ENTRADA');
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!produtoId || !quantidade) {
      setErro('Preencha todos os campos');
      return;
    }
    setErro('');
    try {
      await movimentacaoApi.criar({
        produtoId: Number(produtoId),
        tipo,
        quantidade: Number(quantidade),
      });
      setProdutoId('');
      setQuantidade('');
      onMovimentacaoCriada();
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? 'Erro ao registrar movimentação');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nova Movimentação</h3>
      <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)}>
        <option value="">Selecione o produto</option>
        {produtos.map((produto) => (
          <option key={produto.id} value={produto.id}>
            {produto.nome}
          </option>
        ))}
      </select>
      <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoMovimentacao)}>
        <option value="ENTRADA">Entrada</option>
        <option value="SAIDA">Saída</option>
      </select>
      <input
        placeholder="Quantidade"
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <button type="submit">Salvar</button>
    </form>
  );
}
