/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Favourite` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Visited` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Favourite" DROP CONSTRAINT "Favourite_userId_fkey";

-- DropForeignKey
ALTER TABLE "Visited" DROP CONSTRAINT "Visited_userId_fkey";

-- AlterTable
ALTER TABLE "Favourite" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Visited" ALTER COLUMN "userId" SET NOT NULL;

-- DropTable
DROP TABLE "User";
