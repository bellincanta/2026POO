// src/components/ListaCategorias.tsx
import { type Categoria } from '../types';

interface Props {
  categorias: Categoria[];
}

export function ListaCategorias({ categorias }: Props) {
  return (
    <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((categoria) => (
          <tr key={categoria.id}>
            <td>{categoria.id}</td>
            <td>{categoria.nome}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}