import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFilterDto } from './dto/create-filter.dto';
import { UpdateFilterDto } from './dto/update-filter.dto';

@Injectable()
export class FiltersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFilterDto: CreateFilterDto) {
    return this.prisma.filter.create({
      data: {
        stationId: createFilterDto.stationId,
        substance: createFilterDto.substance,
        beforeCleaning: createFilterDto.beforeCleaning,
        afterCleaning: createFilterDto.afterCleaning,
        efficiencyProject: createFilterDto.efficiencyProject,
        efficiencyActual: createFilterDto.efficiencyActual,
      },
    });
  }

  async findAll() {
    return this.prisma.filter.findMany({
      include: {
        station: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.filter.findUnique({
      where: { id },
      include: {
        station: true,
      },
    });
  }

  async update(id: string, updateFilterDto: UpdateFilterDto) {
    return this.prisma.filter.update({
      where: { id },
      data: {
        ...updateFilterDto,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.filter.delete({
      where: { id },
    });
  }
}
