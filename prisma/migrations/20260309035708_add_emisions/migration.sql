-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmissionRecord" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "totalEmission" DECIMAL(16,5) NOT NULL,
    "solidAsh" DECIMAL(16,5) NOT NULL,
    "nox" DECIMAL(16,5) NOT NULL,
    "no2" DECIMAL(16,5) NOT NULL,
    "no" DECIMAL(16,5) NOT NULL,
    "so2" DECIMAL(16,5) NOT NULL,
    "co" DECIMAL(16,5) NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmissionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_name_key" ON "Station"("name");

-- CreateIndex
CREATE INDEX "EmissionRecord_year_month_idx" ON "EmissionRecord"("year", "month");

-- CreateIndex
CREATE INDEX "EmissionRecord_stationId_idx" ON "EmissionRecord"("stationId");

-- CreateIndex
CREATE UNIQUE INDEX "EmissionRecord_stationId_year_month_key" ON "EmissionRecord"("stationId", "year", "month");

-- AddForeignKey
ALTER TABLE "EmissionRecord" ADD CONSTRAINT "EmissionRecord_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmissionRecord" ADD CONSTRAINT "EmissionRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
