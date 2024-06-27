import { Global, Module } from '@nestjs/common';

import { CarBrandRepository } from './services/car-brand.repository';
import { CarModelRepository } from './services/car-model.repository';
import { CarPostRepository } from './services/car-post.repository';
import { RegionRepository } from './services/region.repository';
import { TokensRepository } from './services/tokens.repository';
import { UserRepository } from './services/user.repository';

const repositories = [
  UserRepository,
  TokensRepository,
  RegionRepository,
  CarPostRepository,
  CarBrandRepository,
  CarModelRepository,
];

@Global()
@Module({
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoryModule {}
