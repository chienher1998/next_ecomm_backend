/*
  Warnings:

  - A unique constraint covering the columns `[imageFile]` on the table `NFT` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[imageName]` on the table `NFT` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageName` to the `NFT` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageFile` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `NFT` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userName` on table `NFT` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "NFT" DROP CONSTRAINT "NFT_userId_userName_fkey";

-- DropIndex
DROP INDEX "NFT_desc_key";

-- AlterTable
ALTER TABLE "NFT" ADD COLUMN     "imageName" TEXT NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "imageFile" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "userName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NFT_imageFile_key" ON "NFT"("imageFile");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_imageName_key" ON "NFT"("imageName");

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_userId_userName_fkey" FOREIGN KEY ("userId", "userName") REFERENCES "User"("id", "name") ON DELETE RESTRICT ON UPDATE CASCADE;
