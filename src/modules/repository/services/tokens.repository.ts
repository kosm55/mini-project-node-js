import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TokensEntity } from '../../../database/entities/tokens.entity';

@Injectable()
export class TokensRepository extends Repository<TokensEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(TokensEntity, dataSource.manager);
  }
}
