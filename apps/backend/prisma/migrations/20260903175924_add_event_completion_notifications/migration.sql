-- AlterTable
ALTER TABLE "PetEvent" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true;
