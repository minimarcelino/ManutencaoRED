/*
  Warnings:

  - You are about to drop the column `servidor_idservidor` on the `pee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `pee` DROP FOREIGN KEY `fk_pee_servidor1`;

-- AlterTable
ALTER TABLE `pee` DROP COLUMN `servidor_idservidor`;

-- CreateTable
CREATE TABLE `pee_servidor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `peeId` INTEGER NOT NULL,
    `servidorId` INTEGER NOT NULL,

    INDEX `peeId`(`peeId`),
    INDEX `servidorId`(`servidorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pee_servidor` ADD CONSTRAINT `pee_servidor_peeId_fkey` FOREIGN KEY (`peeId`) REFERENCES `pee`(`idpee`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pee_servidor` ADD CONSTRAINT `pee_servidor_servidorId_fkey` FOREIGN KEY (`servidorId`) REFERENCES `servidor`(`idservidor`) ON DELETE RESTRICT ON UPDATE CASCADE;
