// src/components/ListaProdutos.tsx
import { type Produto } from '../types';

interface Props {
  produtos: Produto[];
}

export function ListaProdutos({ produtos }: Props) {
  return (
    <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Categoria</th>
          <th>Preço</th>
          <th>Quantidade</th>
        </tr>
      </thead>
      <tbody>
        {produtos.map((produto) => (
          <tr key={produto.id}>
            <td>{produto.id}</td>
            <td>{produto.nome}</td>
            <td>{produto.categoria.nome}</td>
            <td>{produto.preco.toFixed(2)}</td>
            <td>{produto.quantidade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
