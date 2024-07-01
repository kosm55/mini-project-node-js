import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { RoleEnum } from '../../enums/role.enum';
import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpAdminReqDto extends PickType(BaseAuthReqDto, [
  'bio',
  'name',
  'email',
  'password',
  'deviceId',
]) {
  @IsEnum([RoleEnum.ADMIN], {
    message: 'Role must be ADMIN',
  })
  @ApiProperty({
    example: 'admin',
    description: 'The role of the user ADMIN',
    enum: RoleEnum,
  })
  @Transform(TransformHelper.toLowerCase)
  role: RoleEnum;
}

// export class SignUpReqDto {
//   name: string;
//   email: string;
//   password: string;
//   bio?: string;
//   deviceId?: string;
// }
