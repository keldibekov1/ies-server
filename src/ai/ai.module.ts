import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { OpenAIModule } from 'src/openai/openai.module';

@Module({
  imports: [OpenAIModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
