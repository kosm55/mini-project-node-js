import { Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm';

import { RoleEnum } from '../../modules/auth/enums/role.enum';
import { CarPostEntity } from './car-post.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { TokensEntity } from './tokens.entity';

@Entity({ name: TableNameEnum.USERS })
export class UserEntity extends BaseModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { nullable: true })
  bio?: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.CUSTOMER })
  role: RoleEnum;

  @OneToMany(() => TokensEntity, (entity) => entity.user)
  tokens?: TokensEntity[];

  @OneToMany(() => CarPostEntity, (entity) => entity.user)
  carPosts?: CarPostEntity[];

  @UpdateDateColumn()
  update: Date;
}
