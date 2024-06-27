/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'OWNER');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Telegram_User" (
    "id" SERIAL NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "activeEventId" INTEGER NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Telegram_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Telegram_User_telegram_id_key" ON "Telegram_User"("telegram_id");
