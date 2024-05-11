/*
  Warnings:

  - You are about to drop the `atividades` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `atividades` DROP FOREIGN KEY `fk_atividades_pee1`;

-- AlterTable
ALTER TABLE `pee` ADD COLUMN `avaliacaoAtividade` TEXT NULL,
    ADD COLUMN `cumpriuAtividade` VARCHAR(3) NULL,
    ADD COLUMN `dataEntregaAtividade` DATE NULL,
    ADD COLUMN `prazoEntregaAtividade` DATE NULL;

-- DropTable
DROP TABLE `atividades`;
