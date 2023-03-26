/*
  Warnings:

  - Added the required column `status` to the `Invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invite" ADD COLUMN     "status" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "creator" TEXT NOT NULL;
