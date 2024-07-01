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

// export class SignUpReqDto {
//   name: string;
//   email: string;
//   password: string;
//   bio?: string;
//   deviceId?: string;
// }
