-- AlterTable
ALTER TABLE `User` ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active';
