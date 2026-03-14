import { Module } from '@nestjs/common';
import { EmissionService } from './emission.service';
import { EmissionController } from './emission.controller';
import { OpenAIModule } from 'src/openai/openai.module';

@Module({
  imports: [OpenAIModule],
  controllers: [EmissionController],
  providers: [EmissionService],
})
export class EmissionModule {}
