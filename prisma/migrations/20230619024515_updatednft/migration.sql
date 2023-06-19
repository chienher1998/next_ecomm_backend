/*
  Warnings:

  - Made the column `title` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageFile` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_userId_fkey";

-- AlterTable
ALTER TABLE "NFT" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "imageFile" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
