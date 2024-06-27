import { ApiProperty } from '@nestjs/swagger';

export class BaseUserResDto {
  @ApiProperty({
    example: 'asg8f94rhi8sj34dka3sx3dd9h3i4sff',
    description: 'The id of user',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'Leonardo da Vinci',
    description: 'The name of user',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'leonardo@gmail.com',
    description: 'The email of user',
  })
  public readonly email: string;

  @ApiProperty({
    example: 'http://avatar.com/image.png',
    description: 'The avatar of user',
  })
  public readonly avatar?: string;
}
