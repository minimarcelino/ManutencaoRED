/*
  Warnings:

  - You are about to drop the column `abono` on the `pee` table. All the data in the column will be lost.
  - You are about to drop the column `avaliacaoAtividade` on the `pee` table. All the data in the column will be lost.
  - You are about to drop the column `cumpriuAtividade` on the `pee` table. All the data in the column will be lost.
  - You are about to drop the column `dataAvaliacao` on the `pee` table. All the data in the column will be lost.
  - You are about to drop the column `dataEntregaAtividade` on the `pee` table. All the data in the column will be lost.
  - You are about to drop the column `houveAvaliacao` on the `pee` table. All the data in the column will be lost.
  - You are about to drop the column `prazoEntregaAtividade` on the `pee` table. All the data in the column will be lost.
  - You are about to drop the column `situacao` on the `pee_servidor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pee` DROP COLUMN `abono`,
    DROP COLUMN `avaliacaoAtividade`,
    DROP COLUMN `cumpriuAtividade`,
    DROP COLUMN `dataAvaliacao`,
    DROP COLUMN `dataEntregaAtividade`,
    DROP COLUMN `houveAvaliacao`,
    DROP COLUMN `prazoEntregaAtividade`;

-- AlterTable
ALTER TABLE `pee_servidor` DROP COLUMN `situacao`,
    ADD COLUMN `abono` BOOLEAN NULL,
    ADD COLUMN `avaliacaoAtividade` TEXT NULL,
    ADD COLUMN `cumpriuAtividade` VARCHAR(3) NULL,
    ADD COLUMN `dataEntregaAtividade` DATE NULL,
    ADD COLUMN `houveAvaliacao` VARCHAR(3) NULL;

-- RenameIndex
ALTER TABLE `pee_servidor` RENAME INDEX `peeId` TO `pee_servidor_peeId_idx`;

-- RenameIndex
ALTER TABLE `pee_servidor` RENAME INDEX `servidorId` TO `pee_servidor_servidorId_idx`;
