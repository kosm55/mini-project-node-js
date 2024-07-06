import * as process from 'process';

import { CarBrandEntity } from '../../../database/entities/car-brand.entity';
import { CarModelEntity } from '../../../database/entities/car-model.entity';
import { CarPostEntity } from '../../../database/entities/car-post.entity';
import { CurrencyEntity } from '../../../database/entities/currency.entity';
import { RegionEntity } from '../../../database/entities/region.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { CarPostListReqDto } from '../dto/req/car-post-list.req.dto';
import { CarBrandResDto } from '../dto/res/car-brand.res.dto';
import { CarModelResDto } from '../dto/res/car-model.res.dto';
import { CarPostResDto } from '../dto/res/car-post.res.dto';
import { CarPostListResDto } from '../dto/res/car-post-list.res.dto';
import { CurrencyResDto } from '../dto/res/currency.res.dto';
import { RegionResDto } from '../dto/res/region.res.dto';

export class CarPostMapper {
  public static toResponseDTO(carPost: CarPostEntity): CarPostResDto {
    return {
      id: carPost.id,
      region_id: carPost.region_id,
      brand_id: carPost.brand_id,
      model_id: carPost.model_id,
      description: carPost.description,
      year: carPost.year,
      priceInUSD: carPost.priceInUSD,
      priceInEUR: carPost.priceInEUR,
      priceInUAH: carPost.priceInUAH,
      exchangeUSD: carPost.exchangeUSD,
      exchangeEUR: carPost.exchangeEUR,
      exchangeUAH: carPost.exchangeUAH,
      created: carPost.created,
      updated: carPost.update,
      views: carPost.views,
      images: carPost.images ? carPost.images : null,
      user: carPost.user ? UserMapper.toResponseDTO(carPost.user) : null,
    };
  }
  public static toListResponseDTO(
    entities: CarPostEntity[],
    total: number,
    query: CarPostListReqDto,
  ): CarPostListResDto {
    return {
      data: entities.map(this.toResponseDTO),
      meta: {
        total,
        limit: query.limit,
        offset: query.offset,
      },
    };
  }

  public static toResponseBrandDTO(brand: CarBrandEntity): CarBrandResDto {
    return {
      id: brand.id,
      brand_name: brand.brand_name,
    };
  }

  public static toResponseModelDTO(model: CarModelEntity): CarModelResDto {
    return {
      id: model.id,
      model_name: model.model_name,
    };
  }

  public static toResponseRegionDTO(region: RegionEntity): RegionResDto {
    return {
      id: region.id,
      region_name: region.region_name,
    };
  }

  public static toResponseCurrencyDTO(
    currency: CurrencyEntity,
  ): CurrencyResDto {
    return {
      id: currency.id,
      currency_code: currency.currency_code,
    };
  }

  public static toResponseInfoDTO(
    carPost: CarPostEntity,
    avgPriceInUSD: number,
    avgPriceInUAH: number,
    avgPriceInEUR: number,
  ): any {
    return {
      id: carPost.id,
      allViews: carPost.views,
      viewsOnWeek: carPost.viewsOnWeek,
      viewsOnMonth: carPost.viewsOnMonth,
      viewsOnYear: carPost.viewsOnYear,
      avgPriceInUSD,
      avgPriceInUAH,
      avgPriceInEUR,
    };
  }
}
