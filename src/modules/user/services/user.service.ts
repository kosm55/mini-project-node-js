import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AccountTypeEnum } from '../../auth/enums/account-type.enum';
import { IUserData } from '../../auth/interfases/user-data.interface';
import { TokensRepository } from '../../repository/services/tokens.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UpdateUserReqDto } from '../dto/req/update-user.req.dto';
import { UserResDto } from '../dto/res/user.res.dto';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokensRepository: TokensRepository,
  ) {}

  public async getMe(userData: IUserData): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    return UserMapper.toResponseDTO(user);
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    const updatedUser = await this.userRepository.save({ ...user, ...dto });
    return UserMapper.toResponseDTO(updatedUser);
  }

  public async update(
    dto: UpdateUserReqDto,
    userId: string,
  ): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const updatedUser = await this.userRepository.save({ ...user, ...dto });
    return UserMapper.toResponseDTO(updatedUser);
  }
  public async getById(userId: string): Promise<UserResDto> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return UserMapper.toResponseDTO(user);
  }

  public async removeMe(userData: IUserData): Promise<void> {
    await this.tokensRepository.delete({ user_id: userData.userId });
    await this.userRepository.delete({ id: userData.userId });
  }

  public async remove(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    await this.tokensRepository.delete({ user_id: userId });
    await this.userRepository.delete({ id: userId });
  }

  public async isEmailUniqueOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('email is already taken');
    }
  }

  public async changeAccountType(userId: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.accountType = AccountTypeEnum.PREMIUM;
    await this.userRepository.save(user);
  }
}
