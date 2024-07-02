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
  ApiOperation,
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
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('me')
  @ApiOperation({ summary: 'Get me' })
  public async getMe(@CurrentUser() userData: IUserData): Promise<UserResDto> {
    return await this.userService.getMe(userData);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put('me')
  @ApiOperation({ summary: 'Update me' })
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.userService.updateMe(userData, updateUserDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Put('')
  @ApiOperation({ summary: 'Update some user (only for admin, manager)' })
  public async update(
    @CurrentUser() userData: IUserData,
    @Body() updateUserDto: UpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.userService.updateMe(userData, updateUserDto);
  }
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete('me')
  @ApiOperation({ summary: 'Delete me' })
  public async deleteMe(@CurrentUser() userData: IUserData): Promise<void> {
    await this.userService.remove(userData);
  }
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN, RoleEnum.MANAGER)
  @UseGuards(RolesGuard)
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Delete('')
  @ApiOperation({ summary: 'Delete some user (only for admin, manager)' })
  public async delete(@CurrentUser() userData: IUserData): Promise<void> {
    await this.userService.remove(userData);
  }

  @ApiBearerAuth()
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get(':userId')
  @ApiOperation({ summary: 'Get some user' })
  public async getById(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserResDto> {
    return await this.userService.getById(userId);
  }
}
