import { PrismaPromise, Submission } from '@prisma/client';
import prisma from 'lib/prisma';
import { Session } from 'next-auth';

// copilot this the the sql structure:
// CREATE TYPE "FieldType" AS ENUM ('TEXT', 'NUMBER', 'EMAIL', 'DATE', 'CHECKBOX', 'RADIO', 'SELECT', 'TEXTAREA');

// -- CreateTable
// CREATE TABLE "Account" (
//     "id" TEXT NOT NULL,
//     "userId" TEXT NOT NULL,
//     "type" TEXT NOT NULL,
//     "provider" TEXT NOT NULL,
//     "providerAccountId" TEXT NOT NULL,
//     "refresh_token" TEXT,
//     "access_token" TEXT,
//     "expires_at" INTEGER,
//     "token_type" TEXT,
//     "scope" TEXT,
//     "id_token" TEXT,
//     "session_state" TEXT,

//     CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
// );

// -- CreateTable
// CREATE TABLE "Session" (
//     "id" TEXT NOT NULL,
//     "sessionToken" TEXT NOT NULL,
//     "userId" TEXT NOT NULL,
//     "expires" TIMESTAMP(3) NOT NULL,

//     CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
// );

// -- CreateTable
// CREATE TABLE "User" (
//     "id" TEXT NOT NULL,
//     "name" TEXT,
//     "email" TEXT,
//     "emailVerified" TIMESTAMP(3),
//     "image" TEXT,

//     CONSTRAINT "User_pkey" PRIMARY KEY ("id")
// );

// -- CreateTable
// CREATE TABLE "VerificationToken" (
//     "identifier" TEXT NOT NULL,
//     "token" TEXT NOT NULL,
//     "expires" TIMESTAMP(3) NOT NULL
// );

// -- CreateTable
// CREATE TABLE "Project" (
//     "id" TEXT NOT NULL,
//     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     "name" VARCHAR(255) NOT NULL,
//     "description" TEXT NOT NULL,

//     CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
// );

// -- CreateTable
// CREATE TABLE "UsersOnProject" (
//     "id" TEXT NOT NULL,
//     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     "userId" TEXT NOT NULL,
//     "projectId" TEXT NOT NULL,

//     CONSTRAINT "UsersOnProject_pkey" PRIMARY KEY ("id")
// );

// -- CreateTable
// CREATE TABLE "Form" (
//     "id" TEXT NOT NULL,
//     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     "name" VARCHAR(255) NOT NULL,
//     "submissionCount" INTEGER NOT NULL DEFAULT 0,
//     "notificationSettings" JSONB NOT NULL,
//     "projectId" TEXT NOT NULL,

//     CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
// );

// -- CreateTable
// CREATE TABLE "Field" (
//     "id" TEXT NOT NULL,
//     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     "key" TEXT NOT NULL,
//     "label" VARCHAR(255) NOT NULL,
//     "type" "FieldType" NOT NULL,
//     "required" BOOLEAN NOT NULL,
//     "formId" TEXT NOT NULL,

//     CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
// );

// -- CreateTable
// CREATE TABLE "Submission" (
//     "id" TEXT NOT NULL,
//     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     "rawdata" JSONB NOT NULL,
//     "formId" VARCHAR(255) NOT NULL,

//     CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
// );

// -- CreateIndex
// CREATE INDEX "Account_userId_idx" ON "Account"("userId");

// -- CreateIndex
// CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

// -- CreateIndex
// CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

// -- CreateIndex
// CREATE INDEX "Session_userId_idx" ON "Session"("userId");

// -- CreateIndex
// CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

// -- CreateIndex
// CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

// -- CreateIndex
// CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

// -- CreateIndex
// CREATE INDEX "UsersOnProject_userId_idx" ON "UsersOnProject"("userId");

// -- CreateIndex
// CREATE INDEX "UsersOnProject_projectId_idx" ON "UsersOnProject"("projectId");

// -- CreateIndex
// CREATE INDEX "Form_projectId_idx" ON "Form"("projectId");

// -- CreateIndex
// CREATE INDEX "Field_formId_idx" ON "Field"("formId");

// -- CreateIndex
// CREATE INDEX "Submission_formId_idx" ON "Submission"("formId");

export const latest30DaysOfSubmissions = async (userId: string): Promise<any> => {
  if (process.env.DATABASE_PROVIDER === 'postgres') {
    const rawData: Submission[] | null = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") AS date, COUNT(*) AS myCount
      FROM "Submission"
      WHERE "createdAt" > DATE(NOW()) - INTERVAL '30 days'
      AND "formId" IN (
        SELECT "Form"."id"
        FROM "Form"
        INNER JOIN "UsersOnProject" ON "UsersOnProject"."projectId" = "Form"."projectId"
        WHERE "UsersOnProject"."userId" = ${userId}
      )
      GROUP BY DATE_TRUNC('day', "createdAt")
    `;

    return rawData?.map((day: any) => ({
      date: day.date.toISOString().split('T')[0],
      count: Number(day.mycount) || 0,
    }));
  }

  const rawData: Submission[] | null = await prisma.$queryRaw`
    SELECT DATE(createdAt)
    AS date, COUNT(*) AS myCount
    FROM Submission
    WHERE createdAt > DATE(NOW()) - INTERVAL 30 DAY
    AND formId IN (
      SELECT Form.id
      FROM Form
      INNER JOIN UsersOnProject ON UsersOnProject.projectId = Form.projectId
      WHERE UsersOnProject.userId = ${userId}
    )
    GROUP BY DATE(createdAt)
  `;

  return rawData?.map((day: any) => ({
    date: day.date.toISOString().split('T')[0],
    count: Number(day.myCount) || 0,
  }));
};

export const submissionsForFormQuery = (
  formId: string,
  page: any,
  take: number,
  session: Session,
  searchQuery: string = ''
): PrismaPromise<Submission[] | null> => {
  if (process.env.DATABASE_PROVIDER === 'postgres') {
    return prisma.$queryRaw`
      SELECT * FROM "Submission"
      WHERE "formId" = ${formId}
      AND "rawdata"::text ILIKE ${`%${searchQuery}%`}
      AND "formId" IN (
        SELECT "Form"."id"
        FROM "Form"
        INNER JOIN "UsersOnProject" ON "UsersOnProject"."projectId" = "Form"."projectId"
        WHERE "UsersOnProject"."userId" = ${session.userId}
      )
      ORDER BY "createdAt" DESC
      LIMIT ${take}
      OFFSET ${getSkip(page, take)}
    `;
  }

  return prisma.$queryRaw`
      SELECT *
      FROM Submission
      WHERE formId = ${formId}
      AND formId IN (
        SELECT Form.id
        FROM Form
        INNER JOIN UsersOnProject ON UsersOnProject.projectId = Form.projectId
        WHERE UsersOnProject.userId = ${session.userId}
      )
      AND LOWER(rawdata) LIKE ${`%${searchQuery.toLowerCase()}%`}
      ORDER BY createdAt DESC
      LIMIT ${take}
      OFFSET ${getSkip(page, take)};
    `;
};

export const submissionsForFormCountQuery = (
  formId: string,
  session: Session,
  searchQuery: string = ''
): PrismaPromise<any> => {
  if (process.env.DATABASE_PROVIDER === 'postgres') {
    return prisma.$queryRaw`
      SELECT COUNT(*)
      FROM "Submission"
      WHERE "formId" = ${formId}
      AND "formId" IN (
        SELECT "Form"."id"
        FROM "Form"
        INNER JOIN "UsersOnProject" ON "UsersOnProject"."projectId" = "Form"."projectId"
        WHERE "UsersOnProject"."userId" = ${session.userId}
      )
      AND "rawdata"::text ILIKE ${`%${searchQuery}%`}
    `;
  }

  return prisma.$queryRaw`
      SELECT COUNT(*)
      FROM Submission
      WHERE formId = ${formId}
      AND formId IN (
        SELECT Form.id
        FROM Form
        INNER JOIN UsersOnProject ON UsersOnProject.projectId = Form.projectId
        WHERE UsersOnProject.userId = ${session.userId}
      )
      AND LOWER(rawdata) LIKE ${`%${searchQuery.toLowerCase()}%`}
    `;
};

const getSkip = (page: any, take: number) => {
  if (!page || isNaN(Number(page))) {
    return 0;
  }

  return (Number(page) - 1) * take;
};
