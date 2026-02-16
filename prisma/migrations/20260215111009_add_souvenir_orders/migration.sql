-- CreateTable
CREATE TABLE "SouvenirVendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "contact" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SouvenirVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SouvenirProduct" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "images" TEXT[],
    "category" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SouvenirProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SouvenirOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "shippingAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SouvenirOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SouvenirOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "SouvenirOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SouvenirProduct" ADD CONSTRAINT "SouvenirProduct_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "SouvenirVendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SouvenirOrder" ADD CONSTRAINT "SouvenirOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SouvenirOrder" ADD CONSTRAINT "SouvenirOrder_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "SouvenirVendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SouvenirOrderItem" ADD CONSTRAINT "SouvenirOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "SouvenirOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SouvenirOrderItem" ADD CONSTRAINT "SouvenirOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "SouvenirProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
