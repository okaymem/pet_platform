/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `Pet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "photoUrl",
ADD COLUMN     "photo" BYTEA,
ADD COLUMN     "photoType" TEXT;
