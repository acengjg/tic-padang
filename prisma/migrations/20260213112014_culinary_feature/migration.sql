-- CreateTable
CREATE TABLE "CulinarySpot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceRange" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "images" TEXT[],
    "facilities" TEXT[],
    "openingHours" JSONB,
    "menuHighlights" JSONB,
    "contact" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "isHalal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CulinarySpot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CulinaryReview" (
    "id" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "tasteRating" DOUBLE PRECISION,
    "serviceRating" DOUBLE PRECISION,
    "ambienceRating" DOUBLE PRECISION,
    "comment" TEXT NOT NULL,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CulinaryReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CulinaryReview" ADD CONSTRAINT "CulinaryReview_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "CulinarySpot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CulinaryReview" ADD CONSTRAINT "CulinaryReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
