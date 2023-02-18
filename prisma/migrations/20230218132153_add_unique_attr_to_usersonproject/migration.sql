/*
  Warnings:

  - A unique constraint covering the columns `[userId,projectId]` on the table `UsersOnProject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Project_name_idx" ON "Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UsersOnProject_userId_projectId_key" ON "UsersOnProject"("userId", "projectId");
