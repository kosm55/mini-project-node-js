import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { TokensRepository } from '../../repository/services/tokens.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { UserService } from '../../user/services/user.service';
import { SignInReqDto } from '../dto/req/sign-in.req.dto';
import { SignUpReqDto } from '../dto/req/sign-up.req.dto';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { RoleEnum } from '../enums/role.enum';
import { IUserData } from '../interfases/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly tokensRepository: TokensRepository,
  ) {}
  public async singUp(dto: SignUpReqDto, role: RoleEnum): Promise<AuthResDto> {
    await this.userService.isEmailUniqueOrThrow(dto.email);

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.save(
      this.userRepository.create({ ...dto, role: role, password }),
    );
    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
      role,
    });

    await this.tokensRepository.save(
      this.tokensRepository.create({
        user_id: user.id,
        accessToken: pair.accessToken,
        refreshToken: pair.refreshToken,
        deviceId: dto.deviceId,
      }),
    );
    return AuthMapper.toResponseDTO(user, pair);
  }

  public async signIn(dto: SignInReqDto): Promise<AuthResDto> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { password: true, id: true },
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const pair = await this.tokenService.generateAuthTokens({
      userId: user.id,
      deviceId: dto.deviceId,
      role: user.role,
    });

    await this.tokensRepository.delete({
      deviceId: dto.deviceId,
      user_id: user.id,
    });

    await this.tokensRepository.save(
      this.tokensRepository.create({
        user_id: user.id,
        accessToken: pair.accessToken,
        refreshToken: pair.refreshToken,
        deviceId: dto.deviceId,
      }),
    );
    const userEntity = await this.userRepository.findOneBy({ id: user.id });
    return AuthMapper.toResponseDTO(userEntity, pair);
  }
  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    await this.tokensRepository.delete({
      deviceId: userData.deviceId,
      user_id: userData.userId,
    });
    const pair = await this.tokenService.generateAuthTokens({
      userId: userData.userId,
      deviceId: userData.deviceId,
      role: userData.role,
    });
    await this.tokensRepository.save(
      this.tokensRepository.create({
        user_id: userData.userId,
        accessToken: pair.accessToken,
        refreshToken: pair.refreshToken,
        deviceId: userData.deviceId,
      }),
    );
    return AuthMapper.toResponseTokensDTO(pair);
  }
  public async signOut(userData: IUserData): Promise<void> {
    await this.tokensRepository.delete({
      deviceId: userData.deviceId,
      user_id: userData.userId,
    });
  }
}
