/*
  Warnings:

  - The values [DONE] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `projectId` on the `Document` table. All the data in the column will be lost.
  - Added the required column `teamId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('TODO', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE "Task" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Task" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'TODO';
COMMIT;

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_projectId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "projectId",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
