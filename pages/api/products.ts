// pages/api/products.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function manipulador(req, res) {
  if (req.method === 'GET') {
    // Listar todos os produtos
    try {
      const produtos = await prisma.produto.findMany();
      return res.status(200).json(produtos);
    } catch (erro) {
      console.error(erro); // Log do erro no console para depuração
      return res.status(500).json({ erro: "Falha ao carregar produtos" });
    }
  } else if (req.method === 'POST') {
    // Criar um novo produto
    const { nome, descricao, preco, quantidadeEmEstoque, categoriaId } = req.body;

    // Verificar se todos os campos necessários foram preenchidos
    if (!nome || !preco || !quantidadeEmEstoque || !categoriaId) {
      return res.status(400).json({ erro: "Campos obrigatórios não preenchidos" });
    }

    // Log para verificar categoriaId recebido
    console.log("Categoria ID recebido:", categoriaId);

    // Verificar se a categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: {
        id: categoriaId
      }
    });

    if (!categoria) {
      console.log("Categoria não encontrada"); // Log para depuração
      return res.status(400).json({ erro: "Categoria inválida" });
    }

    try {
      const novoProduto = await prisma.produto.create({
        data: {
          nome,
          descricao,
          preco,
          quantidadeEmEstoque,
          categoriaId
        }
      });
      return res.status(201).json(novoProduto);
    } catch (erro) {
      console.error(erro); // Log do erro no console para depuração
      return res.status(500).json({ erro: "Falha ao criar produto" });
    }
  } else if (req.method === 'PUT') {
    // Atualizar um produto existente
    const { id, nome, descricao, preco, quantidadeEmEstoque, categoriaId } = req.body;

    // Verificar se todos os campos necessários foram preenchidos
    if (!id || !nome || !preco || !quantidadeEmEstoque || !categoriaId) {
      return res.status(400).json({ erro: "Campos obrigatórios não preenchidos" });
    }

    // Verificar se a categoria existe
    const categoria = await prisma.categoria.findUnique({
      where: {
        id: categoriaId
      }
    });

    if (!categoria) {
      console.log("Categoria não encontrada"); // Log para depuração
      return res.status(400).json({ erro: "Categoria inválida" });
    }

    try {
      const produtoAtualizado = await prisma.produto.update({
        where: { id },
        data: {
          nome,
          descricao,
          preco,
          quantidadeEmEstoque,
          categoriaId
        }
      });
      return res.status(200).json(produtoAtualizado);
    } catch (erro) {
      console.error(erro); // Log do erro no console para depuração
      return res.status(500).json({ erro: "Falha ao atualizar produto" });
    }
  } else if (req.method === 'DELETE') {
    // Excluir um produto
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ erro: "ID do produto é necessário" });
    }

    try {
      await prisma.produto.delete({
        where: { id: Number(id) }
      });
      return res.status(204).end(); // Nenhum conteúdo após a exclusão
    } catch (erro) {
      console.error(erro); // Log do erro no console para depuração
      return res.status(500).json({ erro: "Falha ao excluir produto" });
    }
  } else {
    return res.status(405).json({ erro: "Método não permitido" });
  }
}
