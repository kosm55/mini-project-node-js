import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
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
import { RoleEnum } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IUserData } from '../auth/interfases/user-data.interface';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';
import { UserResDto } from './dto/res/user.res.dto';
import { UserService } from './services/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  //@Roles(RoleEnum.ADMIN)
  @Roles(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  public async getMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    return await this.userService.getMe(userData);
  }

  @ApiBearerAuth()
  //@Roles(RoleEnum.ADMIN)
  @Roles(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    //@Param('id') id: string,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.userService.updateMe(userData, updateUserDto);
  }
  @ApiBearerAuth()
  @Roles(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete('me')
  public async deleteMe(
    @CurrentUser() userData: IUserData,
    //@Param('id', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.userService.remove(userData);
  }

  @ApiBearerAuth()
  //@Roles(RoleEnum.ADMIN)
  @Roles(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':userId')
  public async getById(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserResDto> {
    return await this.userService.getById(userId);
  }
}
