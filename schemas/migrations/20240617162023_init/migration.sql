/*
  Warnings:

  - The primary key for the `Telegram_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `telegram_id` on the `Telegram_user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Telegram_user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Telegram_user_telegram_id_key";

-- AlterTable
ALTER TABLE "Telegram_user" DROP CONSTRAINT "Telegram_user_pkey",
DROP COLUMN "telegram_id",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT;
DROP SEQUENCE "Telegram_user_id_seq";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timeMin" TEXT NOT NULL,
    "timeMax" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Calendar" (
    "calendarId" TEXT NOT NULL,
    "summary" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_id_key" ON "Event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Calendar_calendarId_key" ON "Calendar"("calendarId");

-- CreateIndex
CREATE UNIQUE INDEX "Telegram_user_id_key" ON "Telegram_user"("id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "Calendar"("calendarId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_telegram_id_fkey" FOREIGN KEY ("telegram_id") REFERENCES "Telegram_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
