import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseUserReqDto {
  @IsOptional()
  @IsString()
  @Length(3, 20)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  @ApiProperty({
    example: 'Leonardo da Vinci',
    description: 'The name of user',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  bio?: string;

  //
  //регулярку винести в константи !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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
  email: string;

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
  password: string;
}
