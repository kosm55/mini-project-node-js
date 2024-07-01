import { RoleEnum } from '../enums/role.enum';

export interface IUserData {
  userId: string;
  email: string;
  deviceId: string;
  role: RoleEnum;
}
