import { CarBrandEntity } from '../../../database/entities/car-brand.entity';
import { CarModelEntity } from '../../../database/entities/car-model.entity';
import { CarPostEntity } from '../../../database/entities/car-post.entity';
import { RegionEntity } from '../../../database/entities/region.entity';
import { UserMapper } from '../../user/services/user.mapper';
import { CarPostListReqDto } from '../dto/req/car-post-list.req.dto';
import { CarBrandResDto } from '../dto/res/car-brand.res.dto';
import { CarModelResDto } from '../dto/res/car-model.res.dto';
import { CarPostResDto } from '../dto/res/car-post.res.dto';
import { CarPostListResDto } from '../dto/res/car-post-list.res.dto';
import { RegionResDto } from '../dto/res/region.res.dto';

export class CarPostMapper {
  public static toResponseDTO(carPost: CarPostEntity): CarPostResDto {
    return {
      id: carPost.id,
      // brand_name: carPost.carBrand.brand_name,
      // model_name: carPost.carModel.model_name,
      // region_name: carPost.region.region_name,

      // brand_name: carPost.brand_id ? carPost.carBrand.brand_name: null,
      // model_name: carPost.model_id ? carPost.carModel: null,
      // region_name: carPost.region_id ? carPost.region : null,

      region_id: carPost.region_id,
      brand_id: carPost.brand_id,
      model_id: carPost.model_id,
      description: carPost.description,
      year: carPost.year,
      price: carPost.price,
      created: carPost.created,
      updated: carPost.update,
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
}
