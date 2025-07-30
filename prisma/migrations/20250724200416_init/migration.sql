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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guestConfirmationId" INTEGER,
    CONSTRAINT "Guest_guestConfirmationId_fkey" FOREIGN KEY ("guestConfirmationId") REFERENCES "GuestConfirmation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Guest" ("createdAt", "email", "guestConfirmationId", "id", "name", "observations", "phone") SELECT "createdAt", "email", "guestConfirmationId", "id", "name", "observations", "phone" FROM "Guest";
DROP TABLE "Guest";
ALTER TABLE "new_Guest" RENAME TO "Guest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
