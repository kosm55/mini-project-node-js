import { ApiProperty } from '@nestjs/swagger';

export class RegionResDto {
  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'region ID',
  })
  id: string;

  @ApiProperty({
    example: 'Kyiv',
    description: 'region name',
  })
  region_name: string;
}
