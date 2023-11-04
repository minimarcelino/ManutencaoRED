/*
  Warnings:

  - Added the required column `prontuario` to the `servidor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servidor` ADD COLUMN `prontuario` VARCHAR(15) NOT NULL;
