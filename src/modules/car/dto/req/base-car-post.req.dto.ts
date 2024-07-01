import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString, IsUUID, Length, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseCarPostReqDto {
  @IsUUID()
  model_id: string;
  //carModel: CarModelEntity;

  @IsUUID()
  brand_id: string;
  //carBrand: CarBrandEntity;

  @IsNumber()
  @Min(1900)
  @Max(2024)
  year: number;

  @IsUUID()
  region_id: string;
  //region: RegionEntity;

  @IsNumber()
  @Min(0)
  @Max(3000000)
  price: number;

  @IsString()
  @Length(0, 3000)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  description: string;
}
