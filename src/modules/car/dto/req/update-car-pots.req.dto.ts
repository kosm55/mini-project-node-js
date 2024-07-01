import { PickType } from '@nestjs/swagger';

import { BaseCarPostReqDto } from './base-car-post.req.dto';

export class UpdateCarPotsReqDto extends PickType(BaseCarPostReqDto, [
  'brand_id',
  'model_id',
  'year',
  'price',
  'region_id',
  'description',
]) {}
