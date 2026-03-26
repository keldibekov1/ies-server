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
}
