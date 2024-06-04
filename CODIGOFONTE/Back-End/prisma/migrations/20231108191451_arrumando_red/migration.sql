/*
  Warnings:

  - You are about to drop the column `dataInicioRed` on the `red` table. All the data in the column will be lost.
  - You are about to drop the column `dataLimitePee` on the `red` table. All the data in the column will be lost.
  - Added the required column `aplicacaoAvalicao` to the `red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atividadeAvaliativa` to the `red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cumprimentoAtividade` to the `red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataEnvioPEE` to the `red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `novaAtividade` to the `red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observacao` to the `red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodoAfastamento` to the `red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `realizaoAvalicao` to the `red` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `red` DROP COLUMN `dataInicioRed`,
    DROP COLUMN `dataLimitePee`,
    ADD COLUMN `aplicacaoAvalicao` DATE NOT NULL,
    ADD COLUMN `atividadeAvaliativa` VARCHAR(5) NOT NULL,
    ADD COLUMN `cumprimentoAtividade` VARCHAR(5) NOT NULL,
    ADD COLUMN `dataEnvioPEE` DATE NOT NULL,
    ADD COLUMN `novaAtividade` VARCHAR(15) NOT NULL,
    ADD COLUMN `observacao` VARCHAR(200) NOT NULL,
    ADD COLUMN `periodoAfastamento` DATE NOT NULL,
    ADD COLUMN `realizaoAvalicao` VARCHAR(5) NOT NULL;
