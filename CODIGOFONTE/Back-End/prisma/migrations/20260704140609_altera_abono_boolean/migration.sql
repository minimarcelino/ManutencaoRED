/*
  Warnings:

  - You are about to drop the column `abono` on the `pee` table. All the data in the column will be lost.
  - Added the required column `Abono` to the `pee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pee` DROP COLUMN `abono`,
    ADD COLUMN `Abono` BOOLEAN NOT NULL;
