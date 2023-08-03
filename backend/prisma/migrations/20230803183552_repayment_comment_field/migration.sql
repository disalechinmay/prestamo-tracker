/*
  Warnings:

  - Added the required column `comments` to the `Repayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Repayment" ADD COLUMN     "comments" TEXT NOT NULL;
