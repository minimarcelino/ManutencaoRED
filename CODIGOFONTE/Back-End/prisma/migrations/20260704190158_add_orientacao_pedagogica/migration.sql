/*
  Warnings:

  - You are about to drop the column `Abono` on the `pee` table. All the data in the column will be lost.
  - You are about to drop the column `avaliacoesRealizadas` on the `pee` table. All the data in the column will be lost.
  - Added the required column `abono` to the `pee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pee` DROP COLUMN `Abono`,
    DROP COLUMN `avaliacoesRealizadas`,
    ADD COLUMN `abono` BOOLEAN NOT NULL,
    ADD COLUMN `orientacaoPedagogica` LONGTEXT NULL;
