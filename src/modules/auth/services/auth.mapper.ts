import { UserEntity } from '../../../database/entities/user.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { ITokenPair } from '../interfases/token-pair.interface';
import { IUserData } from '../interfases/user-data.interface';

export class AuthMapper {
  public static toResponseDTO(
    user: UserEntity,
    tokenPair: ITokenPair,
  ): AuthResDto {
    return {
      tokens: this.toResponseTokensDTO(tokenPair),
      user: UserMapper.toResponseDTO(user),
    };
  }

  public static toResponseTokensDTO(tokenPair: ITokenPair): TokenPairResDto {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  public static toUserDataDTO(user: UserEntity, deviceId: string): IUserData {
    return {
      userId: user.id,
      email: user.email,
      deviceId,
      role: user.role,
    };
  }
}
