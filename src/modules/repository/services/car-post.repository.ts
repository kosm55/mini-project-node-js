import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CarPostEntity } from '../../../database/entities/car-post.entity';

@Injectable()
export class CarPostRepository extends Repository<CarPostEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarPostEntity, dataSource.manager);
  }
}
