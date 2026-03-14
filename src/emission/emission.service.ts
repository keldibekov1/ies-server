import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';
import { OpenAIService } from 'src/openai/openai.service';

export type ForecastField = 'totalEmission' | 'solidAsh' | 'nox' | 'no2' | 'no' | 'so2' | 'co';

@Injectable()
export class EmissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openai: OpenAIService,
  ) {}

  async create(data: CreateEmissionDto) {
    const station = await this.prisma.station.findUnique({
      where: { id: data.stationId },
    });

    if (!station) {
      throw new NotFoundException('Station topilmadi');
    }

    const totalEmission =
      Number(data.solidAsh) +
      Number(data.nox) +
      Number(data.no2) +
      Number(data.no) +
      Number(data.so2) +
      Number(data.co);

    try {
      return await this.prisma.emissionRecord.create({
        data: {
          ...data,
          totalEmission,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(
          'Bu stansiya uchun shu yil va oy ma’lumoti allaqachon mavjud',
        );
      }

      throw error;
    }
  }

  async findAll(stationId?: string, year?: number) {
    return this.prisma.emissionRecord.findMany({
      where: {
        ...(stationId && { stationId }),
        ...(year && { year }),
      },
      include: {
        station: true,
      },
      orderBy: [{ year: 'desc' }, { month: 'asc' }],
    });
  }

  async findLatest(stationId?: string, year?: number, month?: number) {
    if ((year && !month) || (!year && month)) {
      throw new BadRequestException('year va month birga yuborilishi kerak');
    }

    let emission;

    if (year && month) {
      emission = await this.prisma.emissionRecord.findFirst({
        where: {
          ...(stationId && { stationId }),
          year,
          month,
        },
        include: {
          station: true,
        },
      });
    } else {
      emission = await this.prisma.emissionRecord.findFirst({
        where: {
          ...(stationId && { stationId }),
        },
        include: {
          station: true,
        },
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
      });
    }

    if (!emission) {
      throw new NotFoundException('Emission ma’lumotlari topilmadi');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return emission;
  }

  async findOne(id: string) {
    const emission = await this.prisma.emissionRecord.findUnique({
      where: { id },
      include: {
        station: true,
      },
    });

    if (!emission) {
      throw new NotFoundException('Emission topilmadi');
    }

    return emission;
  }

  async update(id: string, data: UpdateEmissionDto) {
    const emission = await this.prisma.emissionRecord.findUnique({
      where: { id },
    });

    if (!emission) {
      throw new NotFoundException('Emission topilmadi');
    }

    const solidAsh = Number(data.solidAsh ?? emission.solidAsh);
    const nox = Number(data.nox ?? emission.nox);
    const no2 = Number(data.no2 ?? emission.no2);
    const no = Number(data.no ?? emission.no);
    const so2 = Number(data.so2 ?? emission.so2);
    const co = Number(data.co ?? emission.co);

    const totalEmission = solidAsh + nox + no2 + no + so2 + co;

    return this.prisma.emissionRecord.update({
      where: { id },
      data: {
        ...data,
        totalEmission,
      },
    });
  }

  async forecast(stationId: string, field: ForecastField, months: number) {
    const records = await this.prisma.emissionRecord.findMany({
      where: { stationId },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });

    if (!records.length) {
      throw new NotFoundException('Ma’lumot topilmadi');
    }

    const history = records.map((r) => ({
      year: r.year,
      month: r.month,
      value: Number(r[field]),
    }));

    const aiResult = await this.openai.forecast(field, history, months);

    return {
      field,
      history,
      result: aiResult,
    };
  }

  async remove(id: string) {
    const emission = await this.prisma.emissionRecord.findUnique({
      where: { id },
    });

    if (!emission) {
      throw new NotFoundException('Emission topilmadi');
    }

    return this.prisma.emissionRecord.delete({
      where: { id },
    });
  }
}
