import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('trend')
  trend(@Query('stationId') stationId: string) {
    return this.aiService.trendByStation(stationId);
  }

  @Get('comparison')
  comparison() {
    return this.aiService.comparison();
  }

  @Get('advanced-forecast')
  advancedForecast(@Query('stationId') stationId: string) {
    return this.aiService.advancedForecastAI(stationId);
  }
}
