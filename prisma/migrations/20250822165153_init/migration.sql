-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "inviteSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "GuestConfirmation" ADD COLUMN     "inviteSent" BOOLEAN NOT NULL DEFAULT false;
