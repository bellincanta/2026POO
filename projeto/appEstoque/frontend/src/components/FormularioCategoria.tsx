// src/components/FormularioCategoria.tsx
import { useState } from 'react';
import { categoriaApi } from '../api/api';

interface Props {
  onCategoriaCriada: () => void;
}

export function FormularioCategoria({ onCategoriaCriada }: Props) {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome) {
      setErro('Informe o nome da categoria');
      return;
    }
    setErro('');
    await categoriaApi.criar(nome);
    setNome('');
    onCategoriaCriada();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nova Categoria</h3>
      <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <button type="submit">Salvar</button>
    </form>
  );
}