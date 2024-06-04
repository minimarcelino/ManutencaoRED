/*
  Warnings:

  - Added the required column `nome` to the `servidor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servidor` ADD COLUMN `nome` VARCHAR(60) NOT NULL;
