/*
  Warnings:

  - You are about to drop the `Telegram_User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Telegram_User";

-- CreateTable
CREATE TABLE "Telegram_user" (
    "id" SERIAL NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Telegram_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Telegram_user_telegram_id_key" ON "Telegram_user"("telegram_id");
