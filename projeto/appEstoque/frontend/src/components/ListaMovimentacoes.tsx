// src/components/ListaMovimentacoes.tsx
import { type Movimentacao } from '../types';

interface Props {
  movimentacoes: Movimentacao[];
}

export function ListaMovimentacoes({ movimentacoes }: Props) {
  return (
    <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Produto</th>
          <th>Tipo</th>
          <th>Quantidade</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        {movimentacoes.map((movimentacao) => (
          <tr key={movimentacao.id}>
            <td>{movimentacao.id}</td>
            <td>{movimentacao.produto.nome}</td>
            <td>{movimentacao.tipo}</td>
            <td>{movimentacao.quantidade}</td>
            <td>{new Date(movimentacao.criadoEm).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
