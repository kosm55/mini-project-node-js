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
import { EmailService } from '../../email/email.service';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { CarBrandRepository } from '../../repository/services/car-brand.repository';
import { CarModelRepository } from '../../repository/services/car-model.repository';
import { CarPostRepository } from '../../repository/services/car-post.repository';
import { CurrencyRepository } from '../../repository/services/currency.repository';
import { RegionRepository } from '../../repository/services/region.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CarPostInfoReqDto } from '../dto/req/car-post-info.req.dto';
import { CarPostListReqDto } from '../dto/req/car-post-list.req.dto';
import { CreateCarBrandReqDto } from '../dto/req/create-car-brand.req.dto';
import { CreateCarModelReqDto } from '../dto/req/create-car-model.req.dto';
import { CreateCarPotsReqDto } from '../dto/req/create-car-pots.req.dto';
import { CreateCurrencyReqDto } from '../dto/req/create-currency.req.dto';
import { CreateRegionReqDto } from '../dto/req/create-region.req.dto';
import { UpdateCarPotsReqDto } from '../dto/req/update-car-pots.req.dto';
import { CarBrandResDto } from '../dto/res/car-brand.res.dto';
import { CarModelResDto } from '../dto/res/car-model.res.dto';
import { CarPostResDto } from '../dto/res/car-post.res.dto';
import { CarPostInfoResDto } from '../dto/res/car-post-info.res.dto';
import { CarPostListResDto } from '../dto/res/car-post-list.res.dto';
import { CurrencyResDto } from '../dto/res/currency.res.dto';
import { RegionResDto } from '../dto/res/region.res.dto';
import { CarPostMapper } from './car-post.mapper';
import { ExchangeService } from './exchange.service';

@Injectable()
export class CarPostService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly carPostRepository: CarPostRepository,
    private readonly carBrandRepository: CarBrandRepository,
    private readonly carModelRepository: CarModelRepository,
    private readonly regionRepository: RegionRepository,
    private readonly exchangeService: ExchangeService,
    private readonly currencyRepository: CurrencyRepository,
    private readonly emailService: EmailService,
    private readonly fileStorageService: FileStorageService,
  ) {}

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

  public async create(
    userData: IUserData,
    dto: CreateCarPotsReqDto,
    //carPhotos: Express.Multer.File,
    // carPhotos: Array<Express.Multer.File>,
  ): Promise<CarPostResDto> {
    const list = await this.ListCarPostByUserId(userData.userId);
    if (list.length > 0 && userData.accountType === AccountTypeEnum.BASE) {
      throw new ConflictException(
        'user with BASE account can create only one post',
      );
    }

    const checkBadWord = this.hasBadWord(dto.description);
    if (checkBadWord) {
      dto.isActive = false;
      await this.emailService.sendEmailForManager();
      throw new BadRequestException('bad word forbidden');
    }

    const usd = await this.currencyRepository.findOneBy({
      currency_code: 'USD',
    });
    const eur = await this.currencyRepository.findOneBy({
      currency_code: 'EUR',
    });
    const uah = await this.currencyRepository.findOneBy({
      currency_code: 'UAH',
    });

    if (!usd || !eur || !uah) {
      throw new NotFoundException('currency not found');
    }

    await this.exchangeService.updateExchangeRates();
    const rates = this.exchangeService.getExchangeRates();
    let priceInUSD = 0;
    let priceInEUR = 0;
    let priceInUAH = 0;

    if (dto.currency_id === usd.id) {
      priceInUSD = dto.price;
      priceInUAH = dto.price * rates.USD;
      priceInEUR = priceInUAH / rates.EUR;
    } else if (dto.currency_id === eur.id) {
      priceInEUR = dto.price;
      priceInUAH = dto.price * rates.EUR;
      priceInUSD = priceInUAH / rates.USD;
    } else if (dto.currency_id === uah.id) {
      priceInUAH = dto.price;
      priceInUSD = dto.price / rates.USD;
      priceInEUR = dto.price / rates.EUR;
    }

    const carPost = await this.carPostRepository.save(
      this.carPostRepository.create({
        ...dto,
        user_id: userData.userId,
        exchangeUSD: rates.USD,
        exchangeEUR: rates.EUR,
        exchangeUAH: rates.UAH,
        priceInUSD,
        priceInUAH,
        priceInEUR,
      }),
    );

    // const images = [];
    // for (const item of carPhotos) {
    //   const photo = await this.fileStorageService.uploadFile(
    //     item,
    //     ContentType.CAR_PHOTOS,
    //     carPost.id,
    //   );
    //   images.push(photo);
    // }
    //
    // carPost.images = images;
    // await this.carPostRepository.save(carPost);

    // const photo = await this.fileStorageService.uploadFile(
    //   carPhotos,
    //   ContentType.CAR_PHOTOS,
    //   carPost.id,
    // );

    // carPost.images = photo;
    // await this.carPostRepository.save(carPost);

    return CarPostMapper.toResponseDTO(carPost);
  }

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
    if (
      carPost.user.accountType === AccountTypeEnum.PREMIUM &&
      carPost.user_id !== userData.userId
    ) {
      await this.carPostRepository.incrementViews(carPostId);
    }
    return CarPostMapper.toResponseDTO(carPost);
  }

  public async updateById(
    userData: IUserData,
    carPostId: string,
    dto: UpdateCarPotsReqDto,
  ): Promise<CarPostResDto> {
    await this.IsExistBrandModelRegionOrThrow(
      dto.brand_id,
      dto.model_id,
      dto.region_id,
    );
    const carPost = await this.findMyCarPostByIdOrThrow(
      userData.userId,
      carPostId,
    );
    const checkBadWord = this.hasBadWord(dto.description);
    if (checkBadWord) {
      dto.isActive = false;
      await this.emailService.sendEmailForManager();
      throw new BadRequestException('bad word forbidden');
    }

    await this.carPostRepository.save({ ...carPost, ...dto });
    const updatedCarPost = await this.carPostRepository.findCarPostById(
      userData,
      carPostId,
    );
    return CarPostMapper.toResponseDTO(updatedCarPost);
  }

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

  public async info(
    carPostId: string,
    userData: IUserData,
    query: CarPostInfoReqDto,
  ): Promise<CarPostInfoResDto> {
    if (userData.accountType !== AccountTypeEnum.PREMIUM) {
      throw new ForbiddenException(' only PREMIUM');
    }

    await this.IsExistBrandModelRegionOrThrow(
      query.brand_id,
      query.model_id,
      query.region_id,
    );
    const carPost = await this.carPostRepository.findOne({
      where: { id: carPostId },
    });
    if (!carPost) {
      throw new NotFoundException('post not found');
    }

    let averagePrice;
    if (!query.region_id) {
      averagePrice = await this.carPostRepository.averagePriceAllRegions(
        query.brand_id,
        query.model_id,
      );
    } else {
      averagePrice = await this.carPostRepository.averagePriceOneRegion(
        query.brand_id,
        query.model_id,
        query.region_id,
      );
    }
    console.log(averagePrice, '1');
    return CarPostMapper.toResponseInfoDTO(
      carPost,
      averagePrice.avgPriceInUSD,
      averagePrice.avgPriceInUAH,
      averagePrice.avgPriceInEUR,
    );
  }

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

  public async getAllBrands(): Promise<CarBrandResDto[]> {
    return await this.carBrandRepository.find();
  }

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

  public async getAllModel(): Promise<CarModelResDto[]> {
    return await this.carModelRepository.find();
  }

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
  public async getAllRegion(): Promise<RegionResDto[]> {
    return await this.regionRepository.find();
  }

  public async createCurrency(
    dto: CreateCurrencyReqDto,
  ): Promise<CurrencyResDto> {
    const currency = await this.currencyRepository.findOne({
      where: { currency_code: dto.currency_code },
    });
    if (currency) {
      throw new ConflictException('currency already exist');
    }
    const newCurrency = this.currencyRepository.create(dto);
    await this.currencyRepository.save(newCurrency);
    return CarPostMapper.toResponseCurrencyDTO(newCurrency);
  }
  public async getAllCurrencies(): Promise<CurrencyResDto[]> {
    return await this.currencyRepository.find();
  }

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
  private hasBadWord(description: string): boolean {
    const badWord = ['bad1', 'bad2', 'bad3'];

    const findBadWord = badWord.map((word) => description.includes(word));
    return findBadWord.includes(true);
  }
}
