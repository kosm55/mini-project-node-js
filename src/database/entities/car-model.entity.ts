import { Column, Entity, OneToMany } from 'typeorm';

import { CarPostEntity } from './car-post.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';

@Entity({ name: TableNameEnum.CAR_MODELS })
export class CarModelEntity extends BaseModel {
  @Column('text')
  model_name: string;

  @OneToMany(() => CarPostEntity, (entity) => entity.carModel)
  carPosts?: CarPostEntity[];
}
