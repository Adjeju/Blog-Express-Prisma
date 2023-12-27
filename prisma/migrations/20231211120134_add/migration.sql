-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GroupRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    CONSTRAINT "GroupRole_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "GroupMember" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GroupRole" ("id", "memberId", "name") SELECT "id", "memberId", "name" FROM "GroupRole";
DROP TABLE "GroupRole";
ALTER TABLE "new_GroupRole" RENAME TO "GroupRole";
CREATE TABLE "new_GroupMember" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GroupMember" ("groupId", "id", "userId") SELECT "groupId", "id", "userId" FROM "GroupMember";
DROP TABLE "GroupMember";
ALTER TABLE "new_GroupMember" RENAME TO "GroupMember";
CREATE TABLE "new_GroupInvite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "GroupInvite_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GroupInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GroupInvite" ("groupId", "id", "status", "userId") SELECT "groupId", "id", "status", "userId" FROM "GroupInvite";
DROP TABLE "GroupInvite";
ALTER TABLE "new_GroupInvite" RENAME TO "GroupInvite";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
