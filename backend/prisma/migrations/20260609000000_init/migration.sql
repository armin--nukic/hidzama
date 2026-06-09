CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RESCHEDULED', 'COMPLETED');

CREATE TABLE "users" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'STAFF',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "services" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "titleBs" TEXT NOT NULL,
  "titleEn" TEXT NOT NULL,
  "summaryBs" TEXT NOT NULL,
  "summaryEn" TEXT NOT NULL,
  "descriptionBs" TEXT NOT NULL,
  "descriptionEn" TEXT NOT NULL,
  "durationMin" INTEGER NOT NULL,
  "priceBam" DECIMAL(10,2) NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "categories" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "nameBs" TEXT NOT NULL,
  "nameEn" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "blog_posts" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "titleBs" TEXT NOT NULL,
  "titleEn" TEXT NOT NULL,
  "excerptBs" TEXT NOT NULL,
  "excerptEn" TEXT NOT NULL,
  "contentBs" TEXT NOT NULL,
  "contentEn" TEXT NOT NULL,
  "coverImage" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "publishedAt" TIMESTAMP(3),
  "categoryId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "testimonials" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "quoteBs" TEXT NOT NULL,
  "quoteEn" TEXT NOT NULL,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "appointments" (
  "id" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "time" TEXT NOT NULL,
  "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
  "customerName" TEXT NOT NULL,
  "customerEmail" TEXT NOT NULL,
  "customerPhone" TEXT NOT NULL,
  "notes" TEXT,
  "adminNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "contact_messages" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "settings" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
CREATE INDEX "appointments_date_time_idx" ON "appointments"("date", "time");
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
