-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('FRANCHISE_CREATED', 'STORE_CREATED', 'USER_REGISTERED', 'ORDER_PLACED', 'ORDER_COMPLETED', 'PAYMENT_RECEIVED', 'SUBSCRIPTION_CREATED', 'REFERRAL_REWARDED');

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "totalAmount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "basePrice" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "store_services" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "subscription_plans" ALTER COLUMN "monthlyPrice" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "discountRate" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "wallet_transactions" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "wallets" ALTER COLUMN "balance" DROP DEFAULT,
ALTER COLUMN "balance" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
