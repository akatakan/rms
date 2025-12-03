-- CreateEnum
CREATE TYPE "OrderItemStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'SERVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'MEAL_CARD', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "StockChangeType" AS ENUM ('SALE', 'RESTOCK', 'WASTE', 'CORRECTION');

-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'WAITER', 'KITCHEN', 'CASHIER');

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderOnProduct" (
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "status" "OrderItemStatus" NOT NULL DEFAULT 'PENDING',
    "price_at_order" DOUBLE PRECISION NOT NULL,
    "cost_price_at_order" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderOnProduct_pkey" PRIMARY KEY ("orderId","productId")
);

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "old_status" "OrderStatus" NOT NULL,
    "new_status" "OrderStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changed_by_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total_amount" DOUBLE PRECISION NOT NULL,
    "tax_amount" DOUBLE PRECISION NOT NULL,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "cancel_reason" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cancelled_by_id" TEXT,
    "waiter_id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transaction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cashier_id" TEXT NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "cost_price" DOUBLE PRECISION NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockHistory" (
    "id" TEXT NOT NULL,
    "quantity_change" INTEGER NOT NULL,
    "change_type" "StockChangeType" NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "StockHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tables" (
    "id" TEXT NOT NULL,
    "table_number" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "status" "TableStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_key" ON "Products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tables_table_number_key" ON "Tables"("table_number");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "OrderOnProduct" ADD CONSTRAINT "OrderOnProduct_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnProduct" ADD CONSTRAINT "OrderOnProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_cancelled_by_id_fkey" FOREIGN KEY ("cancelled_by_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_waiter_id_fkey" FOREIGN KEY ("waiter_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockHistory" ADD CONSTRAINT "StockHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
