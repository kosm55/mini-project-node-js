import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.TOKENS })
export class TokensEntity extends BaseModel {
  @Column('text')
  accessToken: string;

  @Column('text')
  refreshToken: string;

  @Column('text')
  deviceId: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.tokens)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
