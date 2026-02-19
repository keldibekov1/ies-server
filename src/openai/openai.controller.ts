import { Controller, Post, Body, Res } from '@nestjs/common';
import { OpenAIService } from './openai.service';

@Controller('ai')
export class OpenAIController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post('chat')
  async chat(@Body('prompt') prompt: string) {
    const response = await this.openaiService.generateText(prompt);
    return { response };
  }
}
