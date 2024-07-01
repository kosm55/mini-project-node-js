import { ApiProperty } from '@nestjs/swagger';

export class CarModelResDto {
  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'model ID',
  })
  id: string;

  @ApiProperty({
    example: 'escalade',
    description: 'model name',
  })
  model_name: string;
}
