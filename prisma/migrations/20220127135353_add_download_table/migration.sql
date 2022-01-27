-- CreateTable
CREATE TABLE "download" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT,
    "count" BIGINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "download_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "download_user_name_key" ON "download"("user_name");
