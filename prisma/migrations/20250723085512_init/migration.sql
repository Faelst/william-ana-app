-- CreateTable
CREATE TABLE "GuestConfirmation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "isChildren" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "observations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guestConfirmationId" INTEGER,
    CONSTRAINT "Guest_guestConfirmationId_fkey" FOREIGN KEY ("guestConfirmationId") REFERENCES "GuestConfirmation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
