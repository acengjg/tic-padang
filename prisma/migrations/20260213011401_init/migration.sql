-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GUIDE';

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "subjectDate" TEXT,
ADD COLUMN     "subjectTitle" TEXT;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "subjectDate" TEXT,
ADD COLUMN     "subjectTitle" TEXT;

-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "audioNarration" TEXT,
ADD COLUMN     "hotspots" JSONB,
ADD COLUMN     "isEnhanced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "scenes" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subjectDate" TEXT,
ADD COLUMN     "subjectTitle" TEXT;
