import { ApiProperty } from '@nestjs/swagger';

import { UserResDto } from '../../../user/dto/res/user.res.dto';

export class CarPostResDto {
  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'Car Post ID',
  })
  id: string;

  // @ApiProperty({
  //   example: 'bmw',
  //   description: 'brand name',
  // })
  // brand_name: string;
  //
  // @ApiProperty({
  //   example: 'bmw',
  //   description: 'brand name',
  // })
  // model_name: string;
  //
  // @ApiProperty({
  //   example: 'bmw',
  //   description: 'brand name',
  // })
  // region_name: string;

  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'brand ID',
  })
  brand_id: string;

  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'model ID',
  })
  model_id: string;

  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'region ID',
  })
  region_id: string;

  @ApiProperty({
    example: 2024,
    description: 'Car year',
  })
  year: number;

  @ApiProperty({
    example: 65000,
    description: 'Car price',
  })
  price: number;

  @ApiProperty({
    example: 'Car Post Description',
    description: 'Car Post Description',
  })
  description: string;

  @ApiProperty({
    example: '2021-09-29T10:00:00.000Z',
    description: 'Car Post Created Date',
  })
  created: Date;

  @ApiProperty({
    example: '2021-09-29T10:00:00.000Z',
    description: 'Car Post Updated Date',
  })
  updated: Date;

  user?: UserResDto;
}
