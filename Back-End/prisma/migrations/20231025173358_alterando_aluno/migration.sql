/*
  Warnings:

  - The primary key for the `aluno` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `aluno_pront` on the `red` table. All the data in the column will be lost.
  - Added the required column `id` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aluno_id` to the `red` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `red` DROP FOREIGN KEY `fk_RED_aluno1`;

-- AlterTable
ALTER TABLE `aluno` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `red` DROP COLUMN `aluno_pront`,
    ADD COLUMN `aluno_id` INTEGER NOT NULL,
    MODIFY `aluno_prontuario` VARCHAR(15) NOT NULL;

-- CreateIndex
CREATE INDEX `fk_RED_aluno1_idx` ON `red`(`aluno_id`);

-- AddForeignKey
ALTER TABLE `red` ADD CONSTRAINT `fk_RED_aluno1` FOREIGN KEY (`aluno_id`) REFERENCES `aluno`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
