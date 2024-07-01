import { Module } from '@nestjs/common';

import { CarPostController } from './car-post.controller';
import { CarPostService } from './services/car-post.service';

@Module({
  imports: [],
  controllers: [CarPostController],
  providers: [CarPostService],
  exports: [CarPostService],
})
export class CarPostModule {}
