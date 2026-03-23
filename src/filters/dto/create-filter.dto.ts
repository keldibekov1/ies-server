import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateFilterDto {
  @ApiProperty()
  @IsUUID()
  stationId: string;

  @ApiProperty({
    example: 'solidAsh',
    description: 'Modda nomi (masalan: solidAsh, mazutAsh)',
  })
  @IsString()
  substance: string;

  @ApiProperty({ example: 22708.32 })
  @IsNumber()
  beforeCleaning: number;

  @ApiProperty({ example: 124.89576 })
  @IsNumber()
  afterCleaning: number;

  @ApiProperty({ example: 99.45 })
  @IsNumber()
  efficiencyProject: number;

  @ApiProperty({ example: 99.45 })
  @IsNumber()
  efficiencyActual: number;
}
