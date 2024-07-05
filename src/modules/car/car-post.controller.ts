import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiFile } from '../../common/decorators/api-file.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IUserData } from '../auth/interfases/user-data.interface';
import { CarPostInfoReqDto } from './dto/req/car-post-info.req.dto';
import { CarPostListReqDto } from './dto/req/car-post-list.req.dto';
import { CreateCarBrandReqDto } from './dto/req/create-car-brand.req.dto';
import { CreateCarModelReqDto } from './dto/req/create-car-model.req.dto';
import { CreateCarPotsReqDto } from './dto/req/create-car-pots.req.dto';
import { CreateCurrencyReqDto } from './dto/req/create-currency.req.dto';
import { CreateRegionReqDto } from './dto/req/create-region.req.dto';
import { UpdateCarPotsReqDto } from './dto/req/update-car-pots.req.dto';
import { CarBrandResDto } from './dto/res/car-brand.res.dto';
import { CarModelResDto } from './dto/res/car-model.res.dto';
import { CarPostResDto } from './dto/res/car-post.res.dto';
import { CarPostInfoResDto } from './dto/res/car-post-info.res.dto';
import { CarPostListResDto } from './dto/res/car-post-list.res.dto';
import { CurrencyResDto } from './dto/res/currency.res.dto';
import { RegionResDto } from './dto/res/region.res.dto';
import { CarPostService } from './services/car-post.service';

@ApiTags('Cars')
@Controller('cars')
export class CarPostController {
  constructor(private readonly carPostService: CarPostService) {}

  @SkipAuth()
  @Get('brand')
  @ApiOperation({ summary: 'get list of brands' })
  public async getAllBrands(): Promise<CarBrandResDto[]> {
    return await this.carPostService.getAllBrands();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('brand')
  @ApiOperation({ summary: 'add new brand (only for admin, manager)' })
  public async createBrand(
    @Body() dto: CreateCarBrandReqDto,
  ): Promise<CarBrandResDto> {
    return await this.carPostService.createBrand(dto);
  }

  @SkipAuth()
  @Get('model')
  @ApiOperation({ summary: 'get list of models' })
  public async getAllModel(): Promise<CarModelResDto[]> {
    return await this.carPostService.getAllModel();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('model')
  @ApiOperation({ summary: 'add new model (only for admin, manager)' })
  public async createModel(
    @Body() dto: CreateCarModelReqDto,
  ): Promise<CarModelResDto> {
    return await this.carPostService.createModel(dto);
  }

  @SkipAuth()
  @Get('region')
  @ApiOperation({ summary: 'get list of regions' })
  public async getAllRegion(): Promise<RegionResDto[]> {
    return await this.carPostService.getAllRegion();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'add new region (only for admin, manager)' })
  @Post('region')
  public async createRegion(
    @Body() dto: CreateRegionReqDto,
  ): Promise<RegionResDto> {
    return await this.carPostService.createRegion(dto);
  }

  @SkipAuth()
  @Get('currency')
  @ApiOperation({ summary: 'get list of currencies' })
  public async getAllCurrencies(): Promise<CurrencyResDto[]> {
    return await this.carPostService.getAllCurrencies();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'add new currency (only for admin, manager)' })
  @Post('currency')
  public async createCurrency(
    @Body() dto: CreateCurrencyReqDto,
  ): Promise<CurrencyResDto> {
    return await this.carPostService.createCurrency(dto);
  }

  @SkipAuth()
  @Get()
  @ApiOperation({ summary: 'get list of car posts' })
  public async getList(
    @CurrentUser() userData: IUserData,
    @Query() query: CarPostListReqDto,
  ): Promise<CarPostListResDto> {
    return await this.carPostService.getList(userData, query);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.SELLER)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // @ApiFile('carPhotos', false)
  // @UseInterceptors(FilesInterceptor('carPhotos'))
  // @ApiConsumes('multipart/form-data')
  @Post()
  @ApiOperation({
    summary: 'create new car post (only for admin, manager, seller)',
  })
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateCarPotsReqDto,
    //@UploadedFile() carPhotos: Express.Multer.File,
    // @UploadedFile() carPhotos: Array<Express.Multer.File>,
  ): Promise<CarPostResDto> {
    return await this.carPostService.create(userData, dto);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':carPostId')
  @ApiOperation({ summary: 'get car post ' })
  public async getById(
    @CurrentUser() userData: IUserData,
    @Param('carPostId', ParseUUIDPipe) carPostId: string,
  ): Promise<CarPostResDto> {
    return await this.carPostService.getById(userData, carPostId);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.SELLER)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':carPostId')
  @ApiOperation({
    summary: 'update car pots (only for admin, manager, seller)',
  })
  public async updateById(
    @CurrentUser() userData: IUserData,
    @Param('carPostId', ParseUUIDPipe) carPostId: string,
    @Body() dto: UpdateCarPotsReqDto,
  ): Promise<CarPostResDto> {
    return await this.carPostService.updateById(userData, carPostId, dto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.SELLER)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  //@HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':carPostId')
  @ApiOperation({
    summary: 'delete car pots (only for admin, manager, seller)',
  })
  public async deleteById(
    @CurrentUser() userData: IUserData,
    @Param('carPostId', ParseUUIDPipe) carPostId: string,
  ): Promise<void> {
    await this.carPostService.deleteById(userData, carPostId);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.SELLER)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get('info/:carPostId')
  @ApiOperation({
    summary: 'info about post (only for admin, manager, seller)',
  })
  public async info(
    @CurrentUser() userData: IUserData,
    @Param('carPostId', ParseUUIDPipe) carPostId: string,
    @Query() query: CarPostInfoReqDto,
  ): Promise<CarPostInfoResDto> {
    return await this.carPostService.info(carPostId, userData, query);
  }
}
