/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "name" TEXT;

-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "desc" TEXT NOT NULL,
    "price" TEXT,
    "imageFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NFT_desc_key" ON "NFT"("desc");

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
