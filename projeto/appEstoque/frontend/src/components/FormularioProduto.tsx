// src/components/FormularioProduto.tsx
import { useState } from 'react';
import { produtoApi } from '../api/api';
import { type Categoria } from '../types';

interface Props {
  categorias: Categoria[];
  onProdutoCriado: () => void;
}

export function FormularioProduto({ categorias, onProdutoCriado }: Props) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome || !preco || !quantidade || !categoriaId) {
      setErro('Preencha todos os campos');
      return;
    }
    setErro('');
    try {
      await produtoApi.criar({
        nome,
        preco: Number(preco),
        quantidade: Number(quantidade),
        categoriaId: Number(categoriaId),
      });
      setNome('');
      setPreco('');
      setQuantidade('');
      setCategoriaId('');
      onProdutoCriado();
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? 'Erro ao criar produto');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Novo Produto</h3>
      <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input
        placeholder="Preço"
        type="number"
        step="0.01"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
      />
      <input
        placeholder="Quantidade"
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />
      <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
        <option value="">Selecione a categoria</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </select>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <button type="submit">Salvar</button>
    </form>
  );
}
