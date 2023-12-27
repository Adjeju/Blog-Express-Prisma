/*
  Warnings:

  - You are about to drop the column `memberId` on the `GroupRole` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_GroupMemberToGroupRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_GroupMemberToGroupRole_A_fkey" FOREIGN KEY ("A") REFERENCES "GroupMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GroupMemberToGroupRole_B_fkey" FOREIGN KEY ("B") REFERENCES "GroupRole" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GroupRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_GroupRole" ("id", "name") SELECT "id", "name" FROM "GroupRole";
DROP TABLE "GroupRole";
ALTER TABLE "new_GroupRole" RENAME TO "GroupRole";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_GroupMemberToGroupRole_AB_unique" ON "_GroupMemberToGroupRole"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupMemberToGroupRole_B_index" ON "_GroupMemberToGroupRole"("B");
