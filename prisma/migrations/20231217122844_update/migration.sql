-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GroupRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "memberId" INTEGER,
    CONSTRAINT "GroupRole_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "GroupMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GroupRole" ("id", "memberId", "name") SELECT "id", "memberId", "name" FROM "GroupRole";
DROP TABLE "GroupRole";
ALTER TABLE "new_GroupRole" RENAME TO "GroupRole";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
