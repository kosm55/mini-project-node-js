import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CarPostEntity } from './car-post.entity';
import { TableNameEnum } from './enums/table-name.enum';

@Entity({ name: TableNameEnum.CAR_MODELS })
export class CarModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  model_name: string;

  @OneToMany(() => CarPostEntity, (entity) => entity.carModel)
  carPosts?: CarPostEntity[];
}
