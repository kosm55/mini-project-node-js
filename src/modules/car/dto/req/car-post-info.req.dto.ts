import { PickType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

import { BaseCarPostReqDto } from './base-car-post.req.dto';

export class CarPostInfoReqDto extends PickType(BaseCarPostReqDto, [
  'brand_id',
  'model_id',
]) {
  @IsUUID()
  @IsOptional()
  region_id?: string;
}
