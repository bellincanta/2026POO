// src/pages/DashboardHome.tsx
//
// Tela de entrada do dashboard: mostra alguns indicadores calculados
// a partir dos produtos carregados. Serve tanto de "boas-vindas" quanto
// de exercício de useMemo/derivação de estado.

import { useEffect, useState } from 'react';
import { produtoApi, categoriaApi } from '../api/api';
import type { Produto, Categoria } from '../types';

const LIMITE_ESTOQUE_BAIXO = 10;

export function DashboardHome() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    Promise.all([produtoApi.listar(), categoriaApi.listar()]).then(
      ([produtosData, categoriasData]) => {
        setProdutos(produtosData);
        setCategorias(categoriasData);
      },
    );
  }, []);

  // Indicadores derivados dos dados carregados. Poderiam vir prontos
  // do backend também (endpoint de "dashboard"), mas aqui calculamos
  // no front para simplificar.
  const totalUnidadesEmEstoque = produtos.reduce((soma, p) => soma + p.quantidade, 0);
  const produtosEstoqueBaixo = produtos.filter((p) => p.quantidade < LIMITE_ESTOQUE_BAIXO);

  return (
    <div>
      <h2>Visão Geral</h2>

      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <CardIndicador titulo="Produtos cadastrados" valor={produtos.length} />
        <CardIndicador titulo="Categorias" valor={categorias.length} />
        <CardIndicador titulo="Unidades em estoque" valor={totalUnidadesEmEstoque} />
        <CardIndicador
          titulo="Estoque baixo"
          valor={produtosEstoqueBaixo.length}
          destaque={produtosEstoqueBaixo.length > 0}
        />
      </div>

      {produtosEstoqueBaixo.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Produtos com estoque baixo (abaixo de {LIMITE_ESTOQUE_BAIXO} unidades)</h3>
          <ul>
            {produtosEstoqueBaixo.map((p) => (
              <li key={p.id}>
                {p.nome} — {p.quantidade} unidade(s)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Pequeno componente auxiliar só para não repetir o mesmo bloco de estilo.
function CardIndicador({
  titulo,
  valor,
  destaque = false,
}: {
  titulo: string;
  valor: number;
  destaque?: boolean;
}) {
  return (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: 8,
        padding: 16,
        minWidth: 160,
        backgroundColor: destaque ? '#fef2f2' : '#fafafa',
      }}
    >
      <div style={{ fontSize: 13, color: '#666' }}>{titulo}</div>
      <div style={{ fontSize: 28, fontWeight: 'bold' }}>{valor}</div>
    </div>
  );
}