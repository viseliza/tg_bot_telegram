-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 45,
    "monday" TEXT NOT NULL DEFAULT '08:00-18:00',
    "tuesday" TEXT NOT NULL DEFAULT '08:00-18:00',
    "wednesday" TEXT NOT NULL DEFAULT '08:00-18:00',
    "thursday" TEXT NOT NULL DEFAULT '08:00-18:00',
    "friday" TEXT NOT NULL DEFAULT '08:00-18:00',
    "saturday" TEXT NOT NULL DEFAULT '08:00-12:00',
    "sunday" TEXT NOT NULL DEFAULT '08:00-12:00',
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Setting_owner_id_key" ON "Setting"("owner_id");

-- AddForeignKey
ALTER TABLE "Setting" ADD CONSTRAINT "Setting_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Telegram_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
