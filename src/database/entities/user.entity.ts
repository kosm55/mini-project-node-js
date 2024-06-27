import { Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm';

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

  @Column('text')
  password: string;

  @Column('text', { nullable: true })
  bio?: string;

  @OneToMany(() => TokensEntity, (entity) => entity.user)
  tokens?: TokensEntity[];

  @OneToMany(() => CarPostEntity, (entity) => entity.user)
  carPosts?: CarPostEntity[];

  @UpdateDateColumn()
  update: Date;
}
