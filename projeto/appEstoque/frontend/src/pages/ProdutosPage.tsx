// src/pages/ProdutosPage.tsx
//
// Página "container": ela busca os dados e coordena a lista + o
// formulário. Os componentes filhos (ListaProdutos, FormularioProduto)
// continuam "burros" — só recebem props e emitem eventos.

import { useEffect, useState } from 'react';
import { type Produto, type Categoria } from '../types';
import { produtoApi, categoriaApi } from '../api/api';
import { ListaProdutos } from '../components/ListaProdutos';
import { FormularioProduto } from '../components/FormularioProduto';

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  async function carregar() {
    setProdutos(await produtoApi.listar());
    setCategorias(await categoriaApi.listar());
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h2>Produtos</h2>
      <ListaProdutos produtos={produtos} />
      <hr />
      <FormularioProduto categorias={categorias} onProdutoCriado={carregar} />
    </div>
  );
}
