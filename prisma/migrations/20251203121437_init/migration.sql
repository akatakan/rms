-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
