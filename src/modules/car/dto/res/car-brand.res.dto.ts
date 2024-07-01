import { ApiProperty } from '@nestjs/swagger';

export class CarBrandResDto {
  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'brand ID',
  })
  id: string;

  @ApiProperty({
    example: 'cadillac',
    description: 'brand name',
  })
  brand_name: string;
}
