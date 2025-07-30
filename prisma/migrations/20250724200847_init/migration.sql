/*
  Warnings:

  - You are about to drop the column `guestConfirmationId` on the `Guest` table. All the data in the column will be lost.
  - Added the required column `guestId` to the `GuestConfirmation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Guest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "goToWedding" BOOLEAN NOT NULL DEFAULT true,
    "goToParty" BOOLEAN NOT NULL DEFAULT true,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Guest" ("createdAt", "email", "goToParty", "goToWedding", "id", "name", "observations", "phone") SELECT "createdAt", "email", "goToParty", "goToWedding", "id", "name", "observations", "phone" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
CREATE TABLE "new_GuestConfirmation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "isChildren" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guestId" INTEGER NOT NULL,
    CONSTRAINT "GuestConfirmation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GuestConfirmation" ("createdAt", "email", "id", "isChildren", "name", "phone") SELECT "createdAt", "email", "id", "isChildren", "name", "phone" FROM "GuestConfirmation";
DROP TABLE "GuestConfirmation";
ALTER TABLE "new_GuestConfirmation" RENAME TO "GuestConfirmation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
