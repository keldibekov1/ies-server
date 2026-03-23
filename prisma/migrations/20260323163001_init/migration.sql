-- CreateTable
CREATE TABLE "Filter" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "substance" TEXT NOT NULL,
    "beforeCleaning" DECIMAL(16,5) NOT NULL,
    "afterCleaning" DECIMAL(16,5) NOT NULL,
    "efficiencyProject" DECIMAL(15,4) NOT NULL,
    "efficiencyActual" DECIMAL(15,4) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
