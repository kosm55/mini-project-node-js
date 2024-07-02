import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CarPostEntity } from '../../../database/entities/car-post.entity';
import { AccountTypeEnum } from '../../auth/enums/account-type.enum';
import { IUserData } from '../../auth/interfases/user-data.interface';
import { CarBrandRepository } from '../../repository/services/car-brand.repository';
import { CarModelRepository } from '../../repository/services/car-model.repository';
import { CarPostRepository } from '../../repository/services/car-post.repository';
import { RegionRepository } from '../../repository/services/region.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CarPostListReqDto } from '../dto/req/car-post-list.req.dto';
import { CreateCarBrandReqDto } from '../dto/req/create-car-brand.req.dto';
import { CreateCarModelReqDto } from '../dto/req/create-car-model.req.dto';
import { CreateCarPotsReqDto } from '../dto/req/create-car-pots.req.dto';
import { CreateRegionReqDto } from '../dto/req/create-region.req.dto';
import { UpdateCarPotsReqDto } from '../dto/req/update-car-pots.req.dto';
import { CarBrandResDto } from '../dto/res/car-brand.res.dto';
import { CarModelResDto } from '../dto/res/car-model.res.dto';
import { CarPostResDto } from '../dto/res/car-post.res.dto';
import { CarPostListResDto } from '../dto/res/car-post-list.res.dto';
import { RegionResDto } from '../dto/res/region.res.dto';
import { CarPostMapper } from './car-post.mapper';

@Injectable()
export class CarPostService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly carPostRepository: CarPostRepository,
    private readonly carBrandRepository: CarBrandRepository,
    private readonly carModelRepository: CarModelRepository,
    private readonly regionRepository: RegionRepository,
  ) {}

  //дописати на створення і онвлення ісАктів на валідацію нецензурних слів, все інше ок

  //все гуд
  public async getList(
    userData: IUserData,
    query: CarPostListReqDto,
  ): Promise<CarPostListResDto> {
    const [entities, total] = await this.carPostRepository.getList(
      userData,
      query,
    );
    return CarPostMapper.toListResponseDTO(entities, total, query);
  }

  // все гуд, респонс юзер null це ок,  бо тут не публікується список ,
  // а просто вертається юзеру його оголошення , хоча все ж може коректно було б додати юзера ,
  // якщо буде час,  як продавець бачить своє повідомлення з інфою про себе
  public async create(
    userData: IUserData,
    dto: CreateCarPotsReqDto,
  ): Promise<CarPostResDto> {
    const list = await this.ListCarPostByUserId(userData.userId);
    if (list.length > 0 && userData.accountType === AccountTypeEnum.BASE) {
      throw new ConflictException(
        'user with BASE account can create only one post',
      );
    }
    const carPost = await this.carPostRepository.save(
      this.carPostRepository.create({
        ...dto,
        user_id: userData.userId,
      }),
    );
    return CarPostMapper.toResponseDTO(carPost);
  }

  // все гуд
  public async getById(
    userData: IUserData,
    carPostId: string,
  ): Promise<CarPostResDto> {
    const carPost = await this.carPostRepository.findCarPostById(
      userData,
      carPostId,
    );
    if (!carPost) {
      throw new NotFoundException('car post  not found');
    }
    return CarPostMapper.toResponseDTO(carPost);
  }

  //все гуд
  public async updateById(
    userData: IUserData,
    carPostId: string,
    dto: UpdateCarPotsReqDto,
  ): Promise<CarPostResDto> {
    // console.log(dto);
    // console.log(dto.brand_id, dto.model_id, dto.region_id); //хз чого червоне,юачить його,
    await this.IsExistBrandModelRegionOrThrow(
      dto.brand_id,
      dto.model_id,
      dto.region_id,
    );
    const carPost = await this.findMyCarPostByIdOrThrow(
      userData.userId,
      carPostId,
    );
    await this.carPostRepository.save({ ...carPost, ...dto });
    const updatedCarPost = await this.carPostRepository.findCarPostById(
      userData,
      carPostId,
    );
    return CarPostMapper.toResponseDTO(updatedCarPost);
  }

  // все гуд
  public async deleteById(
    userData: IUserData,
    carPostId: string,
  ): Promise<void> {
    const carPost = await this.findMyCarPostByIdOrThrow(
      userData.userId,
      carPostId,
    );
    await this.carPostRepository.remove(carPost);
  }

  // все гуд
  public async info(dto: any): Promise<any> {
    return 'some info';
  }

  // все гуд
  public async createBrand(dto: CreateCarBrandReqDto): Promise<CarBrandResDto> {
    const brand = await this.carBrandRepository.findOne({
      where: { brand_name: dto.brand_name },
    });
    if (brand) {
      throw new ConflictException('brand already exist');
    }
    const newBrand = this.carBrandRepository.create(dto);
    await this.carBrandRepository.save(newBrand);
    return CarPostMapper.toResponseBrandDTO(newBrand);
  }

  // все гуд
  public async getAllBrands(): Promise<CarBrandResDto[]> {
    return await this.carBrandRepository.find();
  }

  // все гуд
  public async createModel(dto: CreateCarModelReqDto): Promise<CarModelResDto> {
    const model = await this.carModelRepository.findOne({
      where: { model_name: dto.model_name },
    });
    if (model) {
      throw new ConflictException('model already exist');
    }
    const newModel = this.carModelRepository.create(dto);
    await this.carModelRepository.save(newModel);
    return CarPostMapper.toResponseModelDTO(newModel);
  }

  // все гуд
  public async getAllModel(): Promise<CarModelResDto[]> {
    return await this.carModelRepository.find();
  }

  // все гуд
  public async createRegion(dto: CreateRegionReqDto): Promise<RegionResDto> {
    const region = await this.regionRepository.findOne({
      where: { region_name: dto.region_name },
    });
    if (region) {
      throw new ConflictException('region already exist');
    }
    const newRegion = this.regionRepository.create(dto);
    await this.regionRepository.save(newRegion);
    return CarPostMapper.toResponseRegionDTO(newRegion);
  }

  // все гуд
  public async getAllRegion(): Promise<RegionResDto[]> {
    return await this.regionRepository.find();
  }

  // все гуд
  public async findMyCarPostByIdOrThrow(
    userId: string,
    carPostId: string,
  ): Promise<CarPostEntity> {
    const carPost = await this.findCarPostByIdOrThrow(carPostId);
    if (carPost.user_id !== userId) {
      throw new ForbiddenException();
    }
    return carPost;
  }

  private async findCarPostByIdOrThrow(
    carPostId: string,
  ): Promise<CarPostEntity> {
    const carPost = await this.carPostRepository.findOneBy({ id: carPostId });
    if (!carPost) {
      throw new NotFoundException('car post not found');
    }
    return carPost;
  }

  private async ListCarPostByUserId(userId: string): Promise<CarPostEntity[]> {
    return await this.carPostRepository.find({
      where: { user_id: userId },
    });
  }

  // все гуд
  private async IsExistBrandModelRegionOrThrow(
    brand_id: string,
    model_id: string,
    region_id: string,
  ): Promise<void> {
    const brand = await this.carBrandRepository.findOne({
      where: { id: brand_id },
    });
    if (!brand) {
      throw new BadRequestException('invalid brand_id');
    }

    const model = await this.carModelRepository.findOne({
      where: { id: model_id },
    });
    if (!model) {
      throw new BadRequestException('invalid model_id');
    }

    const region = await this.regionRepository.findOne({
      where: { id: region_id },
    });
    if (!region) {
      throw new BadRequestException('invalid region_id');
    }
  }
}
