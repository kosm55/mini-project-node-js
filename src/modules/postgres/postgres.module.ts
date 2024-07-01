import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostgresConnectService } from './postgres-connect.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      useClass: PostgresConnectService,
    }),
  ],
  controllers: [],
  providers: [],
})
export class PostgresModule {}
