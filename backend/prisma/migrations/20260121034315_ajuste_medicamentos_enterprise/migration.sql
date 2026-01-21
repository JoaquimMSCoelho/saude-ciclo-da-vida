/*
  Warnings:

  - You are about to drop the column `instructions` on the `MedicationSchedule` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Medication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medication" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'pill',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MedicationSchedule" DROP COLUMN "instructions";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL;
