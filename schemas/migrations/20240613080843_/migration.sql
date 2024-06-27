/*
  Warnings:

  - Added the required column `telegram_id` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "telegram_id" TEXT NOT NULL;
