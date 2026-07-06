/*
  Warnings:

  - A unique constraint covering the columns `[peeId,servidorId]` on the table `pee_servidor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `pee_servidor_peeId_servidorId_key` ON `pee_servidor`(`peeId`, `servidorId`);
