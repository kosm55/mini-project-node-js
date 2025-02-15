import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CarPostEntity } from './car-post.entity';
import { TableNameEnum } from './enums/table-name.enum';

@Entity({ name: TableNameEnum.CAR_BRANDS })
export class CarBrandEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  brand_name: string;

  @OneToMany(() => CarPostEntity, (entity) => entity.carBrand)
  carPosts?: CarPostEntity[];
}
