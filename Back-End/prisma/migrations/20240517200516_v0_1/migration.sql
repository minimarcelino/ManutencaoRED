-- CreateTable
CREATE TABLE `aluno` (
    `prontuario` VARCHAR(15) NOT NULL,
    `nome` VARCHAR(60) NOT NULL,
    `dataNascimento` DATE NOT NULL,
    `telefone` VARCHAR(11) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `curso_idcurso` INTEGER NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    UNIQUE INDEX `prontuario_UNIQUE`(`prontuario`),
    UNIQUE INDEX `telefone_UNIQUE`(`telefone`),
    UNIQUE INDEX `email_UNIQUE`(`email`),
    INDEX `fk_aluno_curso_idx`(`curso_idcurso`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `curso` (
    `idcurso` INTEGER NOT NULL AUTO_INCREMENT,
    `sigla` VARCHAR(15) NOT NULL,
    `nomeCurso` VARCHAR(60) NOT NULL,
    `coordenador` INTEGER NOT NULL,

    UNIQUE INDEX `sigla_UNIQUE`(`sigla`),
    UNIQUE INDEX `nomeCurso_UNIQUE`(`nomeCurso`),
    INDEX `fk_curso_servidor1_idx`(`coordenador`),
    PRIMARY KEY (`idcurso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disciplinas` (
    `iddisciplinas` INTEGER NOT NULL AUTO_INCREMENT,
    `sigla` VARCHAR(15) NOT NULL,
    `nomeDisciplina` VARCHAR(60) NOT NULL,
    `curso_idcurso` INTEGER NOT NULL,

    INDEX `fk_disciplinas_curso1_idx`(`curso_idcurso`),
    PRIMARY KEY (`iddisciplinas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pee` (
    `idpee` INTEGER NOT NULL AUTO_INCREMENT,
    `situacao` VARCHAR(40) NOT NULL,
    `conteudo` TEXT NOT NULL,
    `metodologia` TEXT NOT NULL,
    `trabalhos` TEXT NOT NULL,
    `bibliografia` TEXT NOT NULL,
    `criterios` TEXT NOT NULL,
    `prazofinal` DATE NOT NULL,
    `RED_idRED` INTEGER NOT NULL,
    `disciplinas_iddisciplinas` INTEGER NOT NULL,
    `canalComunicacao` VARCHAR(30) NULL,
    `observacoes` TEXT NULL,
    `dataEnvioProposta` DATE NULL,
    `hash` VARCHAR(64) NULL,
    `avaliacaoAtividade` TEXT NULL,
    `prazoEntregaAtividade` DATE NULL,
    `dataEntregaAtividade` DATE NULL,
    `cumpriuAtividade` VARCHAR(3) NULL,
    `houveAvaliacao` VARCHAR(3) NULL,
    `avaliacoesRealizadas` VARCHAR(3) NULL,
    `dataAvaliacao` DATE NULL,
    `percentualabono` DOUBLE NOT NULL,

    INDEX `fk_pee_RED1_idx`(`RED_idRED`),
    INDEX `fk_pee_disciplinas1_idx`(`disciplinas_iddisciplinas`),
    PRIMARY KEY (`idpee`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `arquivo` (
    `idArquivo` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `red_idRED` INTEGER NOT NULL,

    INDEX `idx_red_idRED`(`red_idRED`),
    PRIMARY KEY (`idArquivo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `red` (
    `idRED` INTEGER NOT NULL AUTO_INCREMENT,
    `dataInicioProcesso` DATE NOT NULL,
    `dataPrevisaoTermino` DATE NOT NULL,
    `motivoAfastamento` TEXT NOT NULL,
    `situacao` VARCHAR(40) NOT NULL,
    `coordenador` INTEGER NOT NULL,
    `aluno_id` INTEGER NOT NULL,
    `observacao` TEXT NULL,
    `motivoRecusa` TEXT NULL,
    `inicioAfastamento` DATE NOT NULL,
    `tempoAfastamento` INTEGER NULL,
    `semestreOuAnoAluno` INTEGER NULL,

    INDEX `fk_RED_aluno1_idx`(`aluno_id`),
    INDEX `fk_RED_servidor1_idx`(`coordenador`),
    PRIMARY KEY (`idRED`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servidor` (
    `idservidor` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(60) NOT NULL,
    `tiposervidor` VARCHAR(15) NOT NULL,
    `senha` VARCHAR(60) NOT NULL,
    `nome` VARCHAR(60) NOT NULL,
    `prontuario` VARCHAR(15) NOT NULL,
    `token` VARCHAR(64) NULL,

    UNIQUE INDEX `email_UNIQUE`(`email`),
    UNIQUE INDEX `prontuario_UNIQUE`(`prontuario`),
    PRIMARY KEY (`idservidor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `aluno` ADD CONSTRAINT `fk_aluno_curso` FOREIGN KEY (`curso_idcurso`) REFERENCES `curso`(`idcurso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `curso` ADD CONSTRAINT `fk_curso_servidor1` FOREIGN KEY (`coordenador`) REFERENCES `servidor`(`idservidor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `disciplinas` ADD CONSTRAINT `fk_disciplinas_curso1` FOREIGN KEY (`curso_idcurso`) REFERENCES `curso`(`idcurso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pee` ADD CONSTRAINT `fk_pee_RED1` FOREIGN KEY (`RED_idRED`) REFERENCES `red`(`idRED`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pee` ADD CONSTRAINT `fk_pee_disciplinas1` FOREIGN KEY (`disciplinas_iddisciplinas`) REFERENCES `disciplinas`(`iddisciplinas`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `arquivo` ADD CONSTRAINT `fk_arquivo_red` FOREIGN KEY (`red_idRED`) REFERENCES `red`(`idRED`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `red` ADD CONSTRAINT `fk_RED_aluno1` FOREIGN KEY (`aluno_id`) REFERENCES `aluno`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `red` ADD CONSTRAINT `fk_RED_servidor1` FOREIGN KEY (`coordenador`) REFERENCES `servidor`(`idservidor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pee_servidor` ADD CONSTRAINT `pee_servidor_peeId_fkey` FOREIGN KEY (`peeId`) REFERENCES `pee`(`idpee`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pee_servidor` ADD CONSTRAINT `pee_servidor_servidorId_fkey` FOREIGN KEY (`servidorId`) REFERENCES `servidor`(`idservidor`) ON DELETE RESTRICT ON UPDATE CASCADE;
