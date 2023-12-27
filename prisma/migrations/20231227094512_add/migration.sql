/*
  Warnings:

  - A unique constraint covering the columns `[groupId]` on the table `GroupRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `GroupRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupRequest_groupId_key" ON "GroupRequest"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupRequest_userId_key" ON "GroupRequest"("userId");
