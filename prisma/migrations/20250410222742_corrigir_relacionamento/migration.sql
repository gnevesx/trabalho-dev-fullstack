/*
  Warnings:

  - You are about to drop the column `custoTotal` on the `Compra` table. All the data in the column will be lost.
  - You are about to drop the column `fornecedorId` on the `Compra` table. All the data in the column will be lost.
  - You are about to drop the column `tipoTransacao` on the `TransacaoEstoque` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeVendida` on the `Venda` table. All the data in the column will be lost.
  - You are about to drop the column `valorTotal` on the `Venda` table. All the data in the column will be lost.
  - You are about to drop the `Fornecedor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantidade` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Compra" DROP CONSTRAINT "Compra_fornecedorId_fkey";

-- AlterTable
ALTER TABLE "Compra" DROP COLUMN "custoTotal",
DROP COLUMN "fornecedorId",
ALTER COLUMN "dataCompra" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TransacaoEstoque" DROP COLUMN "tipoTransacao",
ALTER COLUMN "dataTransacao" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Venda" DROP COLUMN "quantidadeVendida",
DROP COLUMN "valorTotal",
ADD COLUMN     "quantidade" INTEGER NOT NULL,
ALTER COLUMN "dataVenda" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Fornecedor";
