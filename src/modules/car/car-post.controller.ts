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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IUserData } from '../auth/interfases/user-data.interface';
import { CarPostListReqDto } from './dto/req/car-post-list.req.dto';
import { CreateCarBrandReqDto } from './dto/req/create-car-brand.req.dto';
import { CreateCarModelReqDto } from './dto/req/create-car-model.req.dto';
import { CreateCarPotsReqDto } from './dto/req/create-car-pots.req.dto';
import { CreateRegionReqDto } from './dto/req/create-region.req.dto';
import { UpdateCarPotsReqDto } from './dto/req/update-car-pots.req.dto';
import { CarBrandResDto } from './dto/res/car-brand.res.dto';
import { CarModelResDto } from './dto/res/car-model.res.dto';
import { CarPostResDto } from './dto/res/car-post.res.dto';
import { CarPostListResDto } from './dto/res/car-post-list.res.dto';
import { RegionResDto } from './dto/res/region.res.dto';
import { CarPostService } from './services/car-post.service';

@ApiTags('Cars')
@Controller('cars')
export class CarPostController {
  constructor(private readonly carPostService: CarPostService) {}

  @SkipAuth()
  @Get('brand')
  public async getAllBrands(): Promise<CarBrandResDto[]> {
    return await this.carPostService.getAllBrands();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('brand')
  public async createBrand(
    @Body() dto: CreateCarBrandReqDto,
  ): Promise<CarBrandResDto> {
    return await this.carPostService.createBrand(dto);
  }
  @SkipAuth()
  @Get('model')
  public async getAllModel(): Promise<CarModelResDto[]> {
    return await this.carPostService.getAllModel();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('model')
  public async createModel(
    @Body() dto: CreateCarModelReqDto,
  ): Promise<CarModelResDto> {
    return await this.carPostService.createModel(dto);
  }

  @SkipAuth()
  @Get('region')
  public async getAllRegion(): Promise<RegionResDto[]> {
    return await this.carPostService.getAllRegion();
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('region')
  public async createRegion(
    @Body() dto: CreateRegionReqDto,
  ): Promise<RegionResDto> {
    return await this.carPostService.createRegion(dto);
  }

  @ApiBearerAuth()
  // @Roles(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  // @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get()
  public async getList(
    @CurrentUser() userData: IUserData,
    @Query() query: CarPostListReqDto,
  ): Promise<CarPostListResDto> {
    return await this.carPostService.getList(userData, query);
  }

  @ApiBearerAuth()
  // @Roles(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  // @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateCarPotsReqDto,
  ): Promise<CarPostResDto> {
    return await this.carPostService.create(userData, dto);
  }

  @ApiBearerAuth()
  // @Roles(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  // @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':carPostId')
  public async getById(
    @CurrentUser() userData: IUserData,
    @Param('carPostId', ParseUUIDPipe) carPostId: string,
  ): Promise<CarPostResDto> {
    return await this.carPostService.getById(userData, carPostId);
  }

  @ApiBearerAuth()
  // @Roles(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  // @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':carPostId')
  public async updateById(
    @CurrentUser() userData: IUserData,
    @Param('articleId', ParseUUIDPipe) carPostId: string,
    @Body() dto: UpdateCarPotsReqDto,
  ): Promise<CarPostResDto> {
    return await this.carPostService.updateById(userData, carPostId, dto);
  }

  @ApiBearerAuth()
  // @Roles(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  // @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  //@HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':carPostId')
  public async deleteById(
    @CurrentUser() userData: IUserData,
    @Param('carPostId', ParseUUIDPipe) carPostId: string,
  ): Promise<void> {
    await this.carPostService.deleteById(userData, carPostId);
  }
}
