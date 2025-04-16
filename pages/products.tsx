// pages/produtos.tsx
import { useState, useEffect } from 'react';

const PaginaProdutos = () => {
  interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    quantidadeEmEstoque: number;
    categoriaId: number;
  }
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: '',
    descricao: '',
    preco: '',
    quantidadeEmEstoque: '',
    categoriaId: '',
  });
  const [erro, setErro] = useState('');

  // Buscar produtos ao carregar a página
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProdutos(data))
      .catch((err) => setErro('Falha ao carregar produtos'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoProduto((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { nome, descricao, preco, quantidadeEmEstoque, categoriaId } = novoProduto;

    // Validar campos
    if (!nome || !preco || !quantidadeEmEstoque || !categoriaId) {
      setErro('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Converter os valores para números
    const precoNumber = parseFloat(preco);
    const quantidadeEmEstoqueNumber = parseInt(quantidadeEmEstoque, 10);
    const categoriaIdNumber = parseInt(categoriaId, 10);

    // Validar valores numéricos
    if (isNaN(precoNumber) || isNaN(quantidadeEmEstoqueNumber) || isNaN(categoriaIdNumber)) {
      setErro('Preencha valores válidos para preço, quantidade e categoria.');
      return;
    }

    const produtoData = {
      nome,
      descricao,
      preco: precoNumber,
      quantidadeEmEstoque: quantidadeEmEstoqueNumber,
      categoriaId: categoriaIdNumber,
    };

    // Criar novo produto
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtoData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          setErro(data.erro); // Exibir erro caso categoria seja inválida ou outro erro
        } else {
          setProdutos((prev) => [...prev, data]);
          setNovoProduto({
            nome: '',
            descricao: '',
            preco: '',
            quantidadeEmEstoque: '',
            categoriaId: '',
          });
          setErro('');
        }
      })
      .catch((err) => setErro('Falha ao criar produto'));
  };

  return (
    <div>
      <h1>Gestão de Produtos</h1>
      
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <h2>Criar Novo Produto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          value={novoProduto.nome}
          onChange={handleChange}
          placeholder="Nome do Produto"
          required
        />
        <input
          type="text"
          name="descricao"
          value={novoProduto.descricao}
          onChange={handleChange}
          placeholder="Descrição"
        />
        <input
          type="number"
          name="preco"
          value={novoProduto.preco}
          onChange={handleChange}
          placeholder="Preço"
          required
        />
        <input
          type="number"
          name="quantidadeEmEstoque"
          value={novoProduto.quantidadeEmEstoque}
          onChange={handleChange}
          placeholder="Quantidade em Estoque"
          required
        />
        <input
          type="number"
          name="categoriaId"
          value={novoProduto.categoriaId}
          onChange={handleChange}
          placeholder="ID da Categoria"
          required
        />
        <button type="submit">Adicionar Produto</button>
      </form>

      <h2>Lista de Produtos</h2>
      <ul>
        {produtos.map((produto: Produto) => (
          <li key={produto.id}>
            <h3>{produto.nome}</h3>
            <p>{produto.descricao}</p>
            <p>Preço: {produto.preco}</p>
            <p>Quantidade em estoque: {produto.quantidadeEmEstoque}</p>
            <p>ID da Categoria: {produto.categoriaId}</p>
            {/* Implementar ações de edição e exclusão aqui */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaginaProdutos;
