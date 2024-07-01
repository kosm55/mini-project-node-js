import { ApiProperty } from '@nestjs/swagger';

export class BaseUserResDto {
  @ApiProperty({
    example: 'asg8f94rhi8sj34dka3sx3dd9h3i4sff',
  })
  id: string;

  bio?: string;

  name: string;

  @ApiProperty({
    example: 'leonardo@gmail.com',
  })
  email: string;
}
