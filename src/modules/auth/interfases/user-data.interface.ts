import { AccountTypeEnum } from '../enums/account-type.enum';
import { RoleEnum } from '../enums/role.enum';

export interface IUserData {
  userId: string;
  email: string;
  deviceId: string;
  role: RoleEnum;
  accountType: AccountTypeEnum;
}
