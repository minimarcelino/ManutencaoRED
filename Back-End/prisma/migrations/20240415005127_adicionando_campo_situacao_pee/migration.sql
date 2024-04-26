/*
  Warnings:

  - Added the required column `situacao` to the `pee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pee` ADD COLUMN `situacao` VARCHAR(40) NOT NULL;
