import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

async function main() {
  // 1️⃣ Stansiyalarni qo'shamiz
  const angren = await prisma.station.upsert({
    where: { name: 'Ангрен ТЭС' },
    update: {},
    create: { name: 'Ангрен ТЭС' },
  });

  const nAngren = await prisma.station.upsert({
    where: { name: 'Н-Ангрен ТЭС' },
    update: {},
    create: { name: 'Н-Ангрен ТЭС' },
  });

  // 2️⃣ EmissionRecord ma'lumotlari 2024 yil uchun
  const emissions = [
    // Январь
    {
      station: angren,
      year: 2024,
      month: 1,
      total: '2466.33',
      solidAsh: '1836.40',
      nox: '167.1',
      no2: '145.24',
      no: '21.86',
      so2: '438.11',
      co: '24.72',
    },
    {
      station: nAngren,
      year: 2024,
      month: 1,
      total: '32628.98',
      solidAsh: '25021.93',
      nox: '477.76',
      no2: '410.98',
      no: '66.78',
      so2: '7063.29',
      co: '66',
    },

    // Февраль
    {
      station: angren,
      year: 2024,
      month: 2,
      total: '2294.45',
      solidAsh: '1791.9',
      nox: '146.57',
      no2: '127.51',
      no: '19.06',
      so2: '339.76',
      co: '16.22',
    },
    {
      station: nAngren,
      year: 2024,
      month: 2,
      total: '33191.26',
      solidAsh: '26169.72',
      nox: '434.82',
      no2: '374.04',
      no: '60.78',
      so2: '6520.72',
      co: '66',
    },

    // Март
    {
      station: angren,
      year: 2024,
      month: 3,
      total: '2363.06',
      solidAsh: '1887.77',
      nox: '140.4',
      no2: '122.15',
      no: '18.25',
      so2: '318.59',
      co: '16.3',
    },
    {
      station: nAngren,
      year: 2024,
      month: 3,
      total: '27210.28',
      solidAsh: '21429.25',
      nox: '413.3',
      no2: '355.53',
      no: '57.77',
      so2: '5301.33',
      co: '66',
    },

    // Апрель
    {
      station: angren,
      year: 2024,
      month: 4,
      total: '1004.8',
      solidAsh: '827.8',
      nox: '105.1',
      no2: '90.4',
      no: '14.7',
      so2: '55.6',
      co: '16.3',
    },
    {
      station: nAngren,
      year: 2024,
      month: 4,
      total: '14662.71',
      solidAsh: '11344.68',
      nox: '274.33',
      no2: '235.98',
      no: '38.35',
      so2: '2977.7',
      co: '66',
    },

    // Май
    {
      station: angren,
      year: 2024,
      month: 5,
      total: '320',
      solidAsh: '136.8',
      nox: '66.5',
      no2: '57.2',
      no: '9.3',
      so2: '107.4',
      co: '9.3',
    },
    {
      station: nAngren,
      year: 2024,
      month: 5,
      total: '12482.72',
      solidAsh: '9771.22',
      nox: '222.39',
      no2: '191.3',
      no: '31.09',
      so2: '2423.11',
      co: '66',
    },

    // Июнь
    {
      station: angren,
      year: 2024,
      month: 6,
      total: '654.1',
      solidAsh: '507.9',
      nox: '57.7',
      no2: '49.6',
      no: '8.1',
      so2: '81.1',
      co: '7.4',
    },
    {
      station: nAngren,
      year: 2024,
      month: 6,
      total: '14199.43',
      solidAsh: '11152.79',
      nox: '230.25',
      no2: '198.06',
      no: '32.19',
      so2: '2750.39',
      co: '66',
    },

    // Июль
    {
      station: angren,
      year: 2024,
      month: 7,
      total: '135.43',
      solidAsh: '44.7',
      nox: '30.17',
      no2: '25.95',
      no: '4.22',
      so2: '52.66',
      co: '7.9',
    },
    {
      station: nAngren,
      year: 2024,
      month: 7,
      total: '15208.44',
      solidAsh: '11867.15',
      nox: '245.88',
      no2: '211.51',
      no: '34.37',
      so2: '3029.41',
      co: '66',
    },

    // Август
    {
      station: angren,
      year: 2024,
      month: 8,
      total: '729.55',
      solidAsh: '500.22',
      nox: '80.36',
      no2: '69.1',
      no: '11.26',
      so2: '137.2',
      co: '11.77',
    },
    {
      station: nAngren,
      year: 2024,
      month: 8,
      total: '17053.35',
      solidAsh: '13383.46',
      nox: '238.02',
      no2: '204.75',
      no: '33.27',
      so2: '3365.87',
      co: '66',
    },

    // Сентябрь
    {
      station: angren,
      year: 2024,
      month: 9,
      total: '1363.9',
      solidAsh: '816.3',
      nox: '139.5',
      no2: '120',
      no: '19.5',
      so2: '392.3',
      co: '15.8',
    },
    {
      station: nAngren,
      year: 2024,
      month: 9,
      total: '10721.87',
      solidAsh: '6990.2',
      nox: '236.27',
      no2: '203.24',
      no: '33.03',
      so2: '3429.4',
      co: '66',
    },

    // Октябрь
    {
      station: angren,
      year: 2024,
      month: 10,
      total: '1528.1',
      solidAsh: '953.3',
      nox: '102.8',
      no2: '88.4',
      no: '14.4',
      so2: '452.4',
      co: '19.6',
    },
    {
      station: nAngren,
      year: 2024,
      month: 10,
      total: '10745.28',
      solidAsh: '6909.44',
      nox: '211.39',
      no2: '181.84',
      no: '29.55',
      so2: '3558.45',
      co: '66',
    },

    // Ноябрь
    {
      station: angren,
      year: 2024,
      month: 11,
      total: '1444.02',
      solidAsh: '1036.7',
      nox: '101.42',
      no2: '87.22',
      no: '14.2',
      so2: '291.25',
      co: '14.65',
    },
    {
      station: nAngren,
      year: 2024,
      month: 11,
      total: '14772.44',
      solidAsh: '9685.56',
      nox: '313.32',
      no2: '269.52',
      no: '43.8',
      so2: '4707.56',
      co: '66',
    },

    // Декабрь
    {
      station: angren,
      year: 2024,
      month: 12,
      total: '3978.8',
      solidAsh: '2715.22',
      nox: '189',
      no2: '162.5',
      no: '26.5',
      so2: '1046',
      co: '28.58',
    },
    {
      station: nAngren,
      year: 2024,
      month: 12,
      total: '18986.11',
      solidAsh: '11341.89',
      nox: '528.04',
      no2: '454.23',
      no: '73.81',
      so2: '7050.18',
      co: '66',
    },
  ];

  for (const e of emissions) {
    await prisma.emissionRecord.create({
      data: {
        stationId: e.station.id,
        year: e.year,
        month: e.month,
        totalEmission: new Decimal(e.total),
        solidAsh: new Decimal(e.solidAsh),
        nox: new Decimal(e.nox),
        no2: new Decimal(e.no2),
        no: new Decimal(e.no),
        so2: new Decimal(e.so2),
        co: new Decimal(e.co),
      },
    });
  }

  console.log('✅ Seed tugadi');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
