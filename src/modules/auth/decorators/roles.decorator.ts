import { SetMetadata } from '@nestjs/common';

import { ROLES } from '../constants/constants';
import { RoleEnum } from '../enums/role.enum';

export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES, roles);
