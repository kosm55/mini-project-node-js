import { ApiProperty } from '@nestjs/swagger';
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
  brand_id: string;

  @IsUUID()
  model_id: string;

  @IsNumber()
  @Min(1900)
  @Max(2024)
  @Type(() => Number)
  year: number;

  @IsUUID()
  region_id: string;

  @IsNumber()
  @Min(0)
  @Max(3000000)
  @Type(() => Number)
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

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  carPhotos?: Express.Multer.File[];
}
