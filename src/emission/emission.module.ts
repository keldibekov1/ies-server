import { Module } from '@nestjs/common';
import { EmissionService } from './emission.service';
import { EmissionController } from './emission.controller';

@Module({
  controllers: [EmissionController],
  providers: [EmissionService],
})
export class EmissionModule {}
