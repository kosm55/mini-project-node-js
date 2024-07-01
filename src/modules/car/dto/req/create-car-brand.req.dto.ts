import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CreateCarBrandReqDto {
  @IsString()
  @Length(0, 300)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  brand_name: string;
}
