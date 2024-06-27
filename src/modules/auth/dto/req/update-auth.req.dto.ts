import { PartialType } from '@nestjs/mapped-types';

import { CreateAuthReqDto } from './create-auth.req.dto';

export class UpdateAuthReqDto extends PartialType(CreateAuthReqDto) {}
