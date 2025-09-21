/*
  Warnings:

  - You are about to drop the column `height` on the `Stylist` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Stylist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Stylist" DROP COLUMN "height",
DROP COLUMN "weight";
