import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateEmissionDto {
  @ApiProperty()
  @IsUUID()
  stationId: string;

  @ApiProperty()
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty()
  @IsNumber()
  solidAsh: number;

  @ApiProperty()
  @IsNumber()
  nox: number;

  @ApiProperty()
  @IsNumber()
  no2: number;

  @ApiProperty()
  @IsNumber()
  no: number;

  @ApiProperty()
  @IsNumber()
  so2: number;

  @ApiProperty()
  @IsNumber()
  co: number;
}
