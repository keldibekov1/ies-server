import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';
import { OpenAIService } from 'src/openai/openai.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

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

  async getAllWithStation() {
    return this.prisma.emissionRecord.findMany({
      include: { station: true },
    });
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

  async exportToExcel(res: Response, stationId?: string, year?: number) {
    const records = await this.prisma.emissionRecord.findMany({
      where: {
        ...(stationId && { stationId }),
        ...(year && { year }),
      },
      include: { station: true },
      orderBy: [{ year: 'desc' }, { month: 'asc' }],
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Emissions');

    sheet.columns = [
      { header: 'Stansiya', key: 'station', width: 20 },
      { header: 'Yil', key: 'year', width: 10 },
      { header: 'Oy', key: 'month', width: 10 },
      { header: 'Jami (totalEmission)', key: 'totalEmission', width: 20 },
      { header: 'Solid Ash', key: 'solidAsh', width: 15 },
      { header: 'NOx', key: 'nox', width: 10 },
      { header: 'NO2', key: 'no2', width: 10 },
      { header: 'NO', key: 'no', width: 10 },
      { header: 'SO2', key: 'so2', width: 10 },
      { header: 'CO', key: 'co', width: 10 },
    ];

    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2563EB' },
      };
      cell.alignment = { horizontal: 'center' };
    });

    records.forEach((r) => {
      sheet.addRow({
        station: r.station?.name ?? r.stationId,
        year: r.year,
        month: r.month,
        totalEmission: Number(r.totalEmission),
        solidAsh: Number(r.solidAsh),
        nox: Number(r.nox),
        no2: Number(r.no2),
        no: Number(r.no),
        so2: Number(r.so2),
        co: Number(r.co),
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="emissions_${Date.now()}.xlsx"`);

    await workbook.xlsx.write(res);
    res.end();
  }
}
