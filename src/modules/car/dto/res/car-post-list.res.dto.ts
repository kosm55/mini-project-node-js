import { CarPostResDto } from './car-post.res.dto';

export class CarPostListResDto {
  data: CarPostResDto[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
