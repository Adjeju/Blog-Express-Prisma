-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostLike" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PostLike" ("id", "postId", "userId") SELECT "id", "postId", "userId" FROM "PostLike";
DROP TABLE "PostLike";
ALTER TABLE "new_PostLike" RENAME TO "PostLike";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
