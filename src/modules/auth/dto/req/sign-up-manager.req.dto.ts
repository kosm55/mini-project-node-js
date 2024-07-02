import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { RoleEnum } from '../../enums/role.enum';
import { BaseAuthReqDto } from './base-auth.req.dto';

export class SignUpManagerReqDto extends PickType(BaseAuthReqDto, [
  'bio',
  'name',
  'email',
  'password',
  'deviceId',
]) {
  @IsEnum([RoleEnum.MANAGER], {
    message: 'Role must be MANAGER',
  })
  @ApiProperty({
    example: 'manager',
    description: 'The role of the user MANAGER',
    enum: RoleEnum,
  })
  @Transform(TransformHelper.toLowerCase)
  role: RoleEnum;
}
