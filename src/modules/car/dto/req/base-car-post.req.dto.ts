import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseCarPostReqDto {
  @IsUUID()
  model_id: string;

  @IsUUID()
  brand_id: string;

  @IsNumber()
  @Min(1900)
  @Max(2024)
  year: number;

  @IsUUID()
  region_id: string;

  @IsNumber()
  @Min(0)
  @Max(3000000)
  price: number;

  @IsUUID()
  currency_id: string;

  @IsString()
  @Length(0, 3000)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  description: string;

  @IsBoolean()
  isActive: boolean;
}
