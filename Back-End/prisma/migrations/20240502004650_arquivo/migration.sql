-- CreateTable
CREATE TABLE `arquivo` (
    `idArquivo` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `red_idRED` INTEGER NOT NULL,

    INDEX `idx_red_idRED`(`red_idRED`),
    PRIMARY KEY (`idArquivo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `arquivo` ADD CONSTRAINT `fk_arquivo_red` FOREIGN KEY (`red_idRED`) REFERENCES `red`(`idRED`) ON DELETE NO ACTION ON UPDATE NO ACTION;
