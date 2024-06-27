import { Column, Entity, OneToMany } from 'typeorm';

import { CarPostEntity } from './car-post.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';

@Entity({ name: TableNameEnum.REGIONS })
export class RegionEntity extends BaseModel {
  @Column('text')
  region_name: string;

  @OneToMany(() => CarPostEntity, (entity) => entity.region)
  carPosts?: CarPostEntity[];
}
