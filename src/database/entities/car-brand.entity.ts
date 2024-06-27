import { Column, Entity, OneToMany } from 'typeorm';

import { CarPostEntity } from './car-post.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';

@Entity({ name: TableNameEnum.CAR_BRANDS })
export class CarBrandEntity extends BaseModel {
  @Column('text')
  brand_name: string;

  @OneToMany(() => CarPostEntity, (entity) => entity.carBrand)
  carPosts?: CarPostEntity[];
}
