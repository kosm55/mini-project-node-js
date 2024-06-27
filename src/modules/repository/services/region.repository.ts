import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RegionEntity } from '../../../database/entities/region.entity';

@Injectable()
export class RegionRepository extends Repository<RegionEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RegionEntity, dataSource.manager);
  }
}
