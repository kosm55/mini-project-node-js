import { UserEntity } from '../../../database/entities/user.entity';
import { UserResDto } from '../dto/res/user.res.dto';

export class UserMapper {
  public static toResponseDTO(user: UserEntity): UserResDto {
    return {
      // все ок хз чого підсвічує що помилка ,  працює коректно
      id: user.id,
      bio: user.bio || null,
      name: user.name,
      email: user.email,
    };
  }
}
