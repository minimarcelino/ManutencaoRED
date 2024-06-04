/*
  Warnings:

  - You are about to drop the column `data_nascimento` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `cordenador` on the `curso` table. All the data in the column will be lost.
  - You are about to drop the column `nomecurso` on the `curso` table. All the data in the column will be lost.
  - You are about to drop the column `nomedisciplina` on the `disciplinas` table. All the data in the column will be lost.
  - You are about to drop the column `aluno_prontuario` on the `red` table. All the data in the column will be lost.
  - You are about to drop the column `aplicacaoAvalicao` on the `red` table. All the data in the column will be lost.
  - You are about to drop the column `atividadeAvaliativa` on the `red` table. All the data in the column will be lost.
  - You are about to drop the column `cumprimentoAtividade` on the `red` table. All the data in the column will be lost.
  - You are about to drop the column `dataEnvioPEE` on the `red` table. All the data in the column will be lost.
  - You are about to drop the column `data_inicio_processo` on the `red` table. All the data in the column will be lost.
  - You are about to drop the column `novaAtividade` on the `red` table. All the data in the column will be lost.
  - You are about to drop the column `periodoAfastamento` on the `red` table. All the data in the column will be lost.
  - You are about to drop the column `realizaoAvalicao` on the `red` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prontuario]` on the table `aluno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[telefone]` on the table `aluno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `aluno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sigla]` on the table `curso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nomeCurso]` on the table `curso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `servidor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[prontuario]` on the table `servidor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataNascimento` to the `aluno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coordenador` to the `curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeCurso` to the `curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeDisciplina` to the `disciplinas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataInicioProcesso` to the `red` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inicioAfastamento` to the `red` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `curso` DROP FOREIGN KEY `fk_curso_servidor1`;

-- AlterTable
ALTER TABLE `aluno` DROP COLUMN `data_nascimento`,
    ADD COLUMN `dataNascimento` DATE NOT NULL;

-- AlterTable
ALTER TABLE `atividades` ADD COLUMN `cumpriuAtividade` CHAR(1) NULL,
    ADD COLUMN `dateEntregaAluno` DATE NULL,
    ADD COLUMN `novaAtividade` CHAR(1) NULL,
    MODIFY `idatividades` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `curso` DROP COLUMN `cordenador`,
    DROP COLUMN `nomecurso`,
    ADD COLUMN `coordenador` INTEGER NOT NULL,
    ADD COLUMN `nomeCurso` VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE `disciplinas` DROP COLUMN `nomedisciplina`,
    ADD COLUMN `nomeDisciplina` VARCHAR(60) NOT NULL;

-- AlterTable
ALTER TABLE `pee` ADD COLUMN `avaliacoesRealizadas` CHAR(1) NULL,
    ADD COLUMN `canalComunicacao` VARCHAR(30) NULL,
    ADD COLUMN `dataAvaliacao` DATE NULL,
    ADD COLUMN `dataEnvioProposta` DATE NULL,
    ADD COLUMN `houveAvaliacao` CHAR(1) NULL,
    ADD COLUMN `observacoes` TEXT NULL;

-- AlterTable
ALTER TABLE `red` DROP COLUMN `aluno_prontuario`,
    DROP COLUMN `aplicacaoAvalicao`,
    DROP COLUMN `atividadeAvaliativa`,
    DROP COLUMN `cumprimentoAtividade`,
    DROP COLUMN `dataEnvioPEE`,
    DROP COLUMN `data_inicio_processo`,
    DROP COLUMN `novaAtividade`,
    DROP COLUMN `periodoAfastamento`,
    DROP COLUMN `realizaoAvalicao`,
    ADD COLUMN `dataInicioProcesso` DATE NOT NULL,
    ADD COLUMN `inicioAfastamento` DATE NOT NULL,
    ADD COLUMN `semestreOuAnoAluno` INTEGER NULL,
    ADD COLUMN `tempoAfastamento` INTEGER NULL;

-- AlterTable
ALTER TABLE `servidor` MODIFY `senha` VARCHAR(60) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `prontuario_UNIQUE` ON `aluno`(`prontuario`);

-- CreateIndex
CREATE UNIQUE INDEX `telefone_UNIQUE` ON `aluno`(`telefone`);

-- CreateIndex
CREATE UNIQUE INDEX `email_UNIQUE` ON `aluno`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `sigla_UNIQUE` ON `curso`(`sigla`);

-- CreateIndex
CREATE UNIQUE INDEX `nomeCurso_UNIQUE` ON `curso`(`nomeCurso`);

-- CreateIndex
CREATE INDEX `fk_curso_servidor1_idx` ON `curso`(`coordenador`);

-- CreateIndex
CREATE UNIQUE INDEX `email_UNIQUE` ON `servidor`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `prontuario_UNIQUE` ON `servidor`(`prontuario`);

-- AddForeignKey
ALTER TABLE `curso` ADD CONSTRAINT `fk_curso_servidor1` FOREIGN KEY (`coordenador`) REFERENCES `servidor`(`idservidor`) ON DELETE NO ACTION ON UPDATE NO ACTION;
