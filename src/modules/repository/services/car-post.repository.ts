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
    const qb = this.createQueryBuilder('article');
    qb.leftJoinAndSelect('article.likes', 'like', 'like.user_id = :myId');
    qb.leftJoinAndSelect('article.tags', 'tag');
    qb.leftJoinAndSelect('article.user', 'user');
    qb.leftJoinAndSelect(
      'user.followings',
      'follow',
      'follow.follower_id = :myId',
    );
    qb.setParameter('myId', userData.userId);

    if (query.search) {
      qb.andWhere(
        'CONCAT(LOWER(article.title), LOWER(article.description), LOWER(article.body)) LIKE :search',
      );
      qb.setParameter('search', `%${query.search}%`);
    }

    qb.orderBy('article.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async findCarPostById(
    userData: IUserData,
    carPostId: string,
  ): Promise<CarPostEntity> {
    const qb = this.createQueryBuilder('article');
    qb.leftJoinAndSelect('article.likes', 'like', 'like.user_id = :myId');
    qb.leftJoinAndSelect('article.tags', 'tag');
    qb.leftJoinAndSelect('article.user', 'user');
    qb.leftJoinAndSelect(
      'user.followings',
      'follow',
      'follow.follower_id = :myId',
    );

    qb.where('article.id = :articleId');
    qb.setParameter('articleId', carPostId);
    qb.setParameter('myId', userData.userId);

    return await qb.getOne();
  }
}
