import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { CarPostEntity } from '../../../database/entities/car-post.entity';
import { IUserData } from '../../auth/interfases/user-data.interface';
import { CarPostListReqDto } from '../../car/dto/req/car-post-list.req.dto';

@Injectable()
export class CarPostRepository extends Repository<CarPostEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CarPostEntity, dataSource.manager);
  }

  public async getList(
    userData: IUserData,
    query: CarPostListReqDto,
  ): Promise<[CarPostEntity[], number]> {
    const qb = this.createQueryBuilder('carPost');
    qb.leftJoinAndSelect('carPost.carBrand', 'carBrand');
    qb.leftJoinAndSelect('carPost.carModel', 'carModel');
    qb.leftJoinAndSelect('carPost.region', 'region');
    qb.leftJoinAndSelect('carPost.user', 'user');

    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(carBrand.brand_name), LOWER(carPost.description), LOWER(carModel.model_name)) LIKE :search',
      );
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.orderBy('carPost.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async findCarPostById(
    userData: IUserData,
    carPostId: string,
  ): Promise<CarPostEntity> {
    const qb = this.createQueryBuilder('carPost');
    qb.leftJoinAndSelect('carPost.carBrand', 'carBrand');
    qb.leftJoinAndSelect('carPost.carModel', 'carModel');
    qb.leftJoinAndSelect('carPost.region', 'region');
    qb.leftJoinAndSelect('carPost.user', 'user');

    qb.where('carPost.id = :carPostId', { carPostId });
    qb.setParameter('carPostId', carPostId);

    return await qb.getOne();
  }

  public async changeIsActive(carPostId: string): Promise<void> {
    await this.createQueryBuilder()
      .update(CarPostEntity)
      .where('id = :id', { id: carPostId })
      .set({ isActive: true } as QueryDeepPartialEntity<CarPostEntity>)
      .execute();
  }

  public async incrementViews(carPostId: string): Promise<void> {
    await this.createQueryBuilder()
      .update(CarPostEntity)
      .set({
        views: () => '"views" + 1',
        viewsOnWeek: () => '"viewsOnWeek" + 1',
        viewsOnMonth: () => '"viewsOnMonth" + 1',
        viewsOnYear: () => '"viewsOnYear" + 1',
      })
      .where('id = :id', { id: carPostId })
      .execute();
  }

  @Cron(CronExpression.EVERY_WEEK)
  public async resetViewsOnWeek(): Promise<void> {
    await this.createQueryBuilder()
      .update(CarPostEntity)
      .set({ viewsOnWeek: 0 } as QueryDeepPartialEntity<CarPostEntity>)
      .execute();
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  public async resetViewsOnMonth(): Promise<void> {
    await this.createQueryBuilder()
      .update(CarPostEntity)
      .set({ viewsOnMonth: 0 } as QueryDeepPartialEntity<CarPostEntity>)
      .execute();
  }

  @Cron(CronExpression.EVERY_YEAR)
  public async resetViewsOnYear(): Promise<void> {
    await this.createQueryBuilder()
      .update(CarPostEntity)
      .set({ viewsOnYear: 0 } as QueryDeepPartialEntity<CarPostEntity>)
      .execute();
  }

  public async averagePriceAllRegions(
    brandId: string,
    modelId: string,
  ): Promise<{
    avgPriceInUSD: number;
    avgPriceInUAH: number;
    avgPriceInEUR: number;
  }> {
    const qb = this.createQueryBuilder('carPost')
      .select('AVG(carPost.priceInUSD)', 'avgPriceInUSD')
      .addSelect('AVG(carPost.priceInUAH)', 'avgPriceInUAH')
      .addSelect('AVG(carPost.priceInEUR)', 'avgPriceInEUR')
      .where('carPost.model_id = :modelId', { modelId })
      .andWhere('carPost.brand_id = :brandId', { brandId });

    const result = await qb.getRawOne();
    return {
      avgPriceInUSD:
        result.avgPriceInUSD !== null ? parseFloat(result.avgPriceInUSD) : 0,
      avgPriceInUAH:
        result.avgPriceInUAH !== null ? parseFloat(result.avgPriceInUAH) : 0,
      avgPriceInEUR:
        result.avgPriceInEUR !== null ? parseFloat(result.avgPriceInEUR) : 0,
    };
  }

  public async averagePriceOneRegion(
    brandId: string,
    modelId: string,
    regionId: string,
  ): Promise<{
    avgPriceInUSD: number;
    avgPriceInUAH: number;
    avgPriceInEUR: number;
  }> {
    const qb = this.createQueryBuilder('carPost')
      .select('AVG(carPost.priceInUSD)', 'avgPriceInUSD')
      .addSelect('AVG(carPost.priceInUAH)', 'avgPriceInUAH')
      .addSelect('AVG(carPost.priceInEUR)', 'avgPriceInEUR')
      .where('carPost.model_id = :modelId', { modelId })
      .andWhere('carPost.brand_id = :brandId', { brandId })
      .andWhere('carPost.region_id = :regionId', { regionId });

    const result = await qb.getRawOne();
    return {
      avgPriceInUSD:
        result.avgPriceInUSD !== null ? parseFloat(result.avgPriceInUSD) : 0,
      avgPriceInUAH:
        result.avgPriceInUAH !== null ? parseFloat(result.avgPriceInUAH) : 0,
      avgPriceInEUR:
        result.avgPriceInEUR !== null ? parseFloat(result.avgPriceInEUR) : 0,
    };
  }
}
