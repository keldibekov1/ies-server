import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(
    private readonly openai: OpenAIService,
    private readonly prisma: PrismaService,
  ) {}

  async trendByStation(stationId: string) {
    const data = await this.prisma.emissionRecord.findMany({
      where: { stationId },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });

    if (!data.length) {
      return 'Maʼlumot topilmadi';
    }

    const avg = data.reduce((sum, d) => sum + Number(d.totalEmission), 0) / data.length;

    const max = Math.max(...data.map((d) => Number(d.totalEmission)));
    const min = Math.min(...data.map((d) => Number(d.totalEmission)));

    const prompt = `
Siz elektr stansiya chiqindilarini tahlil qiluvchi senior data analystsiz.

Statistika:
- O‘rtacha: ${avg}
- Maksimum: ${max}
- Minimum: ${min}

Ma'lumotlar:
${data
  .map(
    (d) =>
      `${d.year}-${String(d.month).padStart(2, '0')}:
total=${d.totalEmission}, NOx=${d.nox}, SO2=${d.so2}, CO=${d.co}`,
  )
  .join('\n')}

Quyidagilarni yozing:
1. Tendensiya
2. Mavsumiylik
3. Xavf omillari
4. Tavsiyalar
`;

    return this.openai.generateText(prompt);
  }

  async comparison() {
    const data = await this.prisma.emissionRecord.findMany({
      include: { station: true },
    });

    if (!data.length) {
      return 'Maʼlumot topilmadi';
    }

    const formatted = data.map((d) => ({
      station: d.station.name,
      totalEmission: Number(d.totalEmission),
      nox: Number(d.nox),
      so2: Number(d.so2),
      co: Number(d.co),
    }));

    const prompt = `
Siz energetika bo‘yicha ekspert analystsiz.
Malumotlar tonna da berilgan
Quyidagi stansiyalarni solishtiring:

${formatted
  .map((d) => `${d.station}: total=${d.totalEmission}, NOx=${d.nox}, SO2=${d.so2}, CO=${d.co}`)
  .join('\n')}

Quyidagilarni yozing:
1. Eng ko‘p chiqindi chiqaradigan stansiya
2. Eng samarali stansiya
3. Farq sabablari
4. Tavsiyalar
`;

    return this.openai.generateText(prompt);
  }

  async advancedForecastAI(stationId: string) {
    const data = await this.prisma.emissionRecord.findMany({
      where: { stationId },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });

    if (!data.length) {
      return 'Maʼlumot topilmadi';
    }

    const formattedData = data
      .map(
        (d) =>
          `${d.year}-${String(d.month).padStart(2, '0')}:
total=${d.totalEmission}, ash=${d.solidAsh}, NOx=${d.nox}, NO2=${d.no2}, NO=${d.no}, SO2=${d.so2}, CO=${d.co}`,
      )
      .join('\n');

    const prompt = `
Siz senior energetika data scientist va ekologiya ekspertisiz.

Sizga elektr stansiyaning oylik emission (chiqindi) (tonna) ma'lumotlari berilgan.
Siz barcha statistik hisob-kitoblarni o'zingiz qilishingiz kerak.

📊 DATA:
${formattedData}

📌 VAZIFA:

1. Trend Analysis:
   - Trend o‘sayaptimi yoki kamayaptimi (% bilan)
   - Barqarorlik darajasi

2. Seasonality:
   - Qaysi oylar yuqori chiqindi
   - Mavsumiy pattern

3. Statistical Metrics:
   - O‘rtacha (mean)
   - Standart og‘ish (std dev)
   - Variatsiya koeffitsiyenti (CV)
   - Growth rate (%)

4. Forecast:
   - Keyingi 1 oy uchun aniq prognoz (raqam bilan)
   - Keyingi 3 oy uchun prognoz
   - Qaysi modelga asoslanding (trend / seasonal / hybrid)

5. Risk Assessment:
   - LOW / MEDIUM / HIGH
   - Sababi bilan

6. Anomaly Detection:
   - Nechta anomal holat bor
   - Qaysi oylar
   - Sababi

7. Correlation Analysis:
   - NOx, SO2, CO o‘rtasidagi bog‘liqlik

8. Recommendations:
   - Texnik (filter, uskuna)
   - Operatsion (yuklama)
   - Strategik

9. Executive Summary:
   - 3-4 qatorda umumiy xulosa

⚠️ MUHIM:
- Faqat aniq va professional yoz
- Raqamlar bilan asosla
- Umumiy gap yozma
- Data scientist kabi yoz
`;

    return this.openai.generateText(prompt);
  }
}
