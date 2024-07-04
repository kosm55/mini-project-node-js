import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CreateCurrencyReqDto {
  @IsString()
  @Length(0, 50)
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  currency_code: string;
}
