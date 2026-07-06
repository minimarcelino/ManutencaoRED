-- AlterTable
ALTER TABLE `pee_servidor` ADD COLUMN `dataAvaliacao` DATE NULL,
    ADD COLUMN `situacao` VARCHAR(20) NOT NULL DEFAULT 'Pendente';
