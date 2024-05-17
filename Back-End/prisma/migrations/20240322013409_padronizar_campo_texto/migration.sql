-- AlterTable
ALTER TABLE `atividades` MODIFY `descricao` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `pee` MODIFY `conteudo` VARCHAR(1000) NOT NULL,
    MODIFY `metodologia` VARCHAR(1000) NOT NULL,
    MODIFY `bibliografia` VARCHAR(1000) NOT NULL,
    MODIFY `criterios` VARCHAR(1000) NOT NULL,
    MODIFY `observacoes` VARCHAR(2000) NULL;

-- AlterTable
ALTER TABLE `red` MODIFY `motivoAfastamento` VARCHAR(2000) NOT NULL,
    MODIFY `observacao` VARCHAR(2000) NULL;
