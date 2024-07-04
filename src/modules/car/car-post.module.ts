import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CarPostController } from './car-post.controller';
import { CarPostService } from './services/car-post.service';
import { ExchangeService } from './services/exchange.service';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [CarPostController],
  providers: [CarPostService, ExchangeService],
  exports: [CarPostService, ExchangeService],
})
export class CarPostModule {}
