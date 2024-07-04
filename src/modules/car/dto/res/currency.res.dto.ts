import { ApiProperty } from '@nestjs/swagger';

export class CurrencyResDto {
  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'currency ID',
  })
  id: string;

  @ApiProperty({
    example: 'USD',
    description: 'currency code',
  })
  currency_code: string;
}
