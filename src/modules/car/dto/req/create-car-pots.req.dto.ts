import { PickType } from '@nestjs/swagger';

import { BaseCarPostReqDto } from './base-car-post.req.dto';

export class CreateCarPotsReqDto extends PickType(BaseCarPostReqDto, [
  'model_id',
  'brand_id',
  'year',
  'price',
  'region_id',
  'description',
]) {}
