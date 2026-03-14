import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { EmissionService, ForecastField } from './emission.service';
import { CreateEmissionDto } from './dto/create-emission.dto';
import { UpdateEmissionDto } from './dto/update-emission.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('emission')
export class EmissionController {
  constructor(private readonly emissionService: EmissionService) {}

  @Post()
  create(@Body() createEmissionDto: CreateEmissionDto) {
    return this.emissionService.create(createEmissionDto);
  }

  @ApiQuery({ name: 'stationId', required: false })
  @ApiQuery({ name: 'year', required: false })
  @Get()
  findAll(@Query('stationId') stationId?: string, @Query('year') year?: number) {
    return this.emissionService.findAll(stationId, Number(year));
  }

  @ApiQuery({ name: 'stationId', required: false })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @Get('latest')
  findLatest(
    @Query('stationId') stationId?: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    return this.emissionService.findLatest(
      stationId,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
    );
  }

  @ApiQuery({ name: 'stationId', required: false })
  @ApiQuery({ name: 'field', required: false })
  @ApiQuery({ name: 'months', required: false, type: Number })
  @Get('forecast')
  forecast(
    @Query('stationId') stationId: string,
    @Query('field') field: string,
    @Query('months') months: string,
  ) {
    return this.emissionService.forecast(stationId, field as ForecastField, Number(months));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emissionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmissionDto: UpdateEmissionDto) {
    return this.emissionService.update(id, updateEmissionDto);
  }
}
