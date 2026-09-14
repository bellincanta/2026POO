// src/pages/CategoriasPage.tsx
//
// Página "container": ela busca os dados e coordena a lista + o
// formulário. Os componentes filhos (ListaCategorias, FormularioCategoria)
// continuam "burros" — só recebem props e emitem eventos.

import { useEffect, useState } from 'react';
import { type Categoria } from '../types';
import { categoriaApi } from '../api/api';
import { ListaCategorias } from '../components/ListaCategorias';
import { FormularioCategoria } from '../components/FormularioCategoria';

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  async function carregar() {
    setCategorias(await categoriaApi.listar());
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div>
      <h2>Categorias</h2>
      <ListaCategorias categorias={categorias} />
      <hr />
      <FormularioCategoria onCategoriaCriada={carregar} />
    </div>
  );
}