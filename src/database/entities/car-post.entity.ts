import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

import { CarBrandEntity } from './car-brand.entity';
import { CarModelEntity } from './car-model.entity';
import { CurrencyEntity } from './currency.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { RegionEntity } from './region.entity';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.CAR_POSTS })
export class CarPostEntity extends BaseModel {
  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.carPosts)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column()
  model_id: string;
  @ManyToOne(() => CarModelEntity, (entity) => entity.carPosts)
  @JoinColumn({ name: 'model_id' })
  carModel?: CarModelEntity;

  @Column()
  brand_id: string;
  @ManyToOne(() => CarBrandEntity, (entity) => entity.carPosts)
  @JoinColumn({ name: 'brand_id' })
  carBrand?: CarBrandEntity;

  @Column()
  year: number;

  @Column()
  region_id: string;
  @ManyToOne(() => RegionEntity, (entity) => entity.carPosts)
  @JoinColumn({ name: 'region_id' })
  region?: RegionEntity;

  @Column()
  price: number;

  @Column()
  currency_id: string;
  @ManyToOne(() => CurrencyEntity, (entity) => entity.carPosts)
  @JoinColumn({ name: 'currency_id' })
  currency?: CurrencyEntity;

  @Column('decimal')
  priceInUSD: number;

  @Column('decimal')
  priceInUAH: number;

  @Column('decimal')
  priceInEUR: number;

  @Column('decimal')
  exchangeUSD: number;

  @Column('decimal')
  exchangeUAH: number;

  @Column('decimal')
  exchangeEUR: number;

  @Column('text')
  description: string;

  @UpdateDateColumn()
  update: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // @Column({ type: 'text', nullable: true })
  // //array: true,
  // images: string;

  @Column({ default: 0, nullable: true })
  views: number;
}
