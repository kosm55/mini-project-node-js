import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CarPostEntity } from './car-post.entity';
import { TableNameEnum } from './enums/table-name.enum';

@Entity({ name: TableNameEnum.CURRENCY })
export class CurrencyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, default: 'USD' })
  currency_code: string;

  @OneToMany(() => CarPostEntity, (entity) => entity.currency)
  carPosts?: CarPostEntity[];
}
