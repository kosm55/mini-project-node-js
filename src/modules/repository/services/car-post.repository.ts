import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

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
}
