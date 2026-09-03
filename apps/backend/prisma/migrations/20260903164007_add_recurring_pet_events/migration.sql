-- AlterTable
ALTER TABLE "PetEvent" ADD COLUMN     "interval" INTEGER,
ADD COLUMN     "intervalUnit" TEXT,
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false;
