import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CarPostEntity } from './car-post.entity';
import { TableNameEnum } from './enums/table-name.enum';

@Entity({ name: TableNameEnum.REGIONS })
export class RegionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  region_name: string;

  @OneToMany(() => CarPostEntity, (entity) => entity.region)
  carPosts?: CarPostEntity[];
}
