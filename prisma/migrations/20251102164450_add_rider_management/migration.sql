-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'RIDER';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveryRiderId" TEXT,
ADD COLUMN     "pickupRiderId" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_pickupRiderId_fkey" FOREIGN KEY ("pickupRiderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_deliveryRiderId_fkey" FOREIGN KEY ("deliveryRiderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
