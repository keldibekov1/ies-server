import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

type ForecastResponse = {
  forecast: number[];
  analysis: string;
};

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY')!,
    });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 1000,
      });

      return completion.choices[0].message.content || '';
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('OpenAI bilan ishlashda xatolik');
    }
  }

  async forecast(
    field: string,
    history: { year: number; month: number; value: number }[],
    months: number,
  ): Promise<ForecastResponse | string> {
    const last = history[history.length - 1];

    const prompt = `
Siz ekologiya bo‘yicha data analystsiz.

Quyidagi ma'lumotlar elektr stansiya chiqindilarining oylik statistikasi.
Ko'rsatkich: ${field}

Muhim:
- Ma'lumotlar oylik kesimda berilgan
- Mavsumiylikni hisobga oling
- Qish oylarida yuklama oshishi mumkinligini inobatga oling

Tarixiy ma'lumotlar:
${history
  .map((item) => `${item.year}-${String(item.month).padStart(2, '0')}: ${item.value}`)
  .join('\n')}

Oxirgi mavjud oy: ${last.year}-${String(last.month).padStart(2, '0')}

Keyingi ${months} oy uchun bashorat qiling.

Natijani faqat JSON formatda qaytaring.
Forecast qiymatlari tarixiy ma'lumotlarga mos ravishda hisoblangan haqiqiy sonlar bo‘lsin.
Misoldagi sonlarni takrorlamang.

Javob formati:
{
  "forecast": [
    { "year": YYYY, "month": MM, "value": NUMBER },
    { "year": YYYY, "month": MM, "value": NUMBER }
  ]
}
`;

    const result = await this.generateText(prompt);

    const clean = result
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(clean) as ForecastResponse;
    } catch {
      return result;
    }
  }
}
