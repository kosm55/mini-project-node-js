import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CreateUserReqDto {
  @IsString()
  @Length(3, 20)
  @Transform(TransformHelper.trim)
  @ApiProperty({
    example: 'Leonardo da Vinci',
    description: 'The name of user',
  })
  public readonly name: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'invalid password, min 8 characters, min: 1 uppercase letter, 1 lowercase letter, 1 digit',
  })
  @Transform(TransformHelper.trim)
  @ApiProperty({
    example: '12@xcadAXf',
    description: 'The password of user',
  })
  public readonly password: string;

  //
  //регулярку винести в константи обовязково!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  //

  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'invalid email',
  })
  @IsString()
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @ApiProperty({
    example: 'leonardo@gmail.com',
    description: 'The email of user',
  })
  public readonly email: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(TransformHelper.trim)
  @ApiProperty({
    example: 'https://avatar.com/image.png',
    description: 'The avatar of user',
  })
  public readonly avatar?: string;
}
