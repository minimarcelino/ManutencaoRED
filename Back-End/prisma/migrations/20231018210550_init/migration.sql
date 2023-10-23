-- CreateTable
CREATE TABLE `aluno` (
    `prontuario` VARCHAR(15) NOT NULL,
    `nome` VARCHAR(60) NOT NULL,
    `data_nascimento` DATE NOT NULL,
    `endereco` VARCHAR(150) NOT NULL,
    `telefone` VARCHAR(11) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `curso_idcurso` INTEGER NOT NULL,

    INDEX `fk_aluno_curso_idx`(`curso_idcurso`),
    PRIMARY KEY (`prontuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `atividades` (
    `idatividades` INTEGER NOT NULL,
    `descricao` VARCHAR(100) NOT NULL,
    `prazoatividade` DATE NOT NULL,
    `pee_idpee` INTEGER NOT NULL,

    INDEX `fk_atividades_pee1_idx`(`pee_idpee`),
    PRIMARY KEY (`idatividades`, `pee_idpee`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `curso` (
    `idcurso` INTEGER NOT NULL AUTO_INCREMENT,
    `sigla` VARCHAR(15) NOT NULL,
    `nomecurso` VARCHAR(60) NOT NULL,
    `cordenador` INTEGER NOT NULL,

    INDEX `fk_curso_servidor1_idx`(`cordenador`),
    PRIMARY KEY (`idcurso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disciplinas` (
    `iddisciplinas` INTEGER NOT NULL AUTO_INCREMENT,
    `sigla` VARCHAR(15) NOT NULL,
    `nomedisciplina` VARCHAR(60) NOT NULL,
    `curso_idcurso` INTEGER NOT NULL,

    INDEX `fk_disciplinas_curso1_idx`(`curso_idcurso`),
    PRIMARY KEY (`iddisciplinas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pee` (
    `idpee` INTEGER NOT NULL AUTO_INCREMENT,
    `conteudo` VARCHAR(600) NOT NULL,
    `metodologia` VARCHAR(700) NOT NULL,
    `trabalhos` VARCHAR(2000) NOT NULL,
    `bibliografia` VARCHAR(700) NOT NULL,
    `criterios` VARCHAR(500) NOT NULL,
    `prazofinal` DATE NOT NULL,
    `RED_idRED` INTEGER NOT NULL,
    `disciplinas_iddisciplinas` INTEGER NOT NULL,
    `servidor_idservidor` INTEGER NOT NULL,
    `percentualabono` DOUBLE NOT NULL,

    INDEX `fk_pee_RED1_idx`(`RED_idRED`),
    INDEX `fk_pee_disciplinas1_idx`(`disciplinas_iddisciplinas`),
    INDEX `fk_pee_servidor1_idx`(`servidor_idservidor`),
    PRIMARY KEY (`idpee`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `red` (
    `idRED` INTEGER NOT NULL AUTO_INCREMENT,
    `data_inicio_processo` DATE NOT NULL,
    `dataInicioRed` DATE NOT NULL,
    `dataLimitePee` DATE NOT NULL,
    `dataPrevisaoTermino` DATE NOT NULL,
    `motivoAfastamento` VARCHAR(200) NOT NULL,
    `situacao` VARCHAR(40) NOT NULL,
    `aluno_prontuario` INTEGER NOT NULL,
    `coordenador` INTEGER NOT NULL,
    `aluno_pront` VARCHAR(15) NOT NULL,

    INDEX `fk_RED_aluno1_idx`(`aluno_pront`),
    INDEX `fk_RED_servidor1_idx`(`coordenador`),
    PRIMARY KEY (`idRED`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servidor` (
    `idservidor` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(60) NOT NULL,
    `tiposervidor` VARCHAR(15) NOT NULL,
    `senha` VARCHAR(12) NOT NULL,

    PRIMARY KEY (`idservidor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aluno` ADD CONSTRAINT `fk_aluno_curso` FOREIGN KEY (`curso_idcurso`) REFERENCES `curso`(`idcurso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `atividades` ADD CONSTRAINT `fk_atividades_pee1` FOREIGN KEY (`pee_idpee`) REFERENCES `pee`(`idpee`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `curso` ADD CONSTRAINT `fk_curso_servidor1` FOREIGN KEY (`cordenador`) REFERENCES `servidor`(`idservidor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `disciplinas` ADD CONSTRAINT `fk_disciplinas_curso1` FOREIGN KEY (`curso_idcurso`) REFERENCES `curso`(`idcurso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pee` ADD CONSTRAINT `fk_pee_RED1` FOREIGN KEY (`RED_idRED`) REFERENCES `red`(`idRED`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pee` ADD CONSTRAINT `fk_pee_disciplinas1` FOREIGN KEY (`disciplinas_iddisciplinas`) REFERENCES `disciplinas`(`iddisciplinas`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pee` ADD CONSTRAINT `fk_pee_servidor1` FOREIGN KEY (`servidor_idservidor`) REFERENCES `servidor`(`idservidor`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `red` ADD CONSTRAINT `fk_RED_aluno1` FOREIGN KEY (`aluno_pront`) REFERENCES `aluno`(`prontuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `red` ADD CONSTRAINT `fk_RED_servidor1` FOREIGN KEY (`coordenador`) REFERENCES `servidor`(`idservidor`) ON DELETE NO ACTION ON UPDATE NO ACTION;
