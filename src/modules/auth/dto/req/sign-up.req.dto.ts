import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { RoleEnum } from '../../enums/role.enum';
import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpReqDto extends PickType(BaseAuthReqDto, [
  'bio',
  'name',
  'email',
  'password',
  'deviceId',
]) {
  @IsEnum([RoleEnum.CUSTOMER, RoleEnum.SELLER], {
    message: 'Role must be CUSTOMER or SELLER',
  })
  @ApiProperty({
    example: 'customer',
    description: 'The role of the user, either CUSTOMER or SELLER',
    enum: RoleEnum,
  })
  @Transform(TransformHelper.toLowerCase)
  role: RoleEnum;
}
//
// export class SignUpReqDto {
//   @IsOptional()
//   @IsString()
//   @Length(3, 20)
//   @Transform(TransformHelper.trim)
//   @Type(() => String)
//   @ApiProperty({
//     example: 'Leonardo da Vinci',
//     description: 'The name of user',
//   })
//   name: string;
//
//   @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
//     message: 'invalid email',
//   })
//   @IsString()
//   @Transform(TransformHelper.trim)
//   @Transform(TransformHelper.toLowerCase)
//   @ApiProperty({
//     example: 'leonardo@gmail.com',
//     description: 'The email of user',
//   })
//   email: string;
//
//   @IsString()
//   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
//     message:
//       'invalid password, min 8 characters, min: 1 uppercase letter, 1 lowercase letter, 1 digit',
//   })
//   @Transform(TransformHelper.trim)
//   @ApiProperty({
//     example: '12@xcadAXf',
//     description: 'The password of user',
//   })
//   password: string;
//
//   @IsOptional()
//   @IsString()
//   @Length(0, 300)
//   bio?: string;
//
//   @IsNotEmpty()
//   @IsString()
//   deviceId?: string;
//
//   @IsEnum([RoleEnum.CUSTOMER, RoleEnum.SELLER], {
//     message: 'Role must be CUSTOMER or SELLER',
//   })
//   @ApiProperty({
//     example: 'customer',
//     description: 'The role of the user, either CUSTOMER or SELLER',
//     enum: RoleEnum,
//   })
//   @Transform(TransformHelper.toLowerCase)
//   role: RoleEnum;
// }
//
