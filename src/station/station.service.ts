import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';

@Injectable()
export class StationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateStationDto) {
    const station = await this.prisma.station.findUnique({
      where: { name: data.name },
    });

    if (station) {
      throw new BadRequestException('Stansiya allaqachon mavjud');
    }

    return this.prisma.station.create({
      data: {
        name: data.name,
      },
    });
  }

  async findAll() {
    return this.prisma.station.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const station = await this.prisma.station.findUnique({
      where: { id },
    });

    if (!station) {
      throw new NotFoundException('Station topilmadi');
    }

    return station;
  }

  async update(id: string, data: UpdateStationDto) {
    await this.findOne(id);

    return this.prisma.station.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.station.delete({
      where: { id },
    });
  }
}
