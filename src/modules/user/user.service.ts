import { Injectable } from '@nestjs/common';

import { UserRepository } from '../repository/services/user.repository';
import { CreateUserReqDto } from './dto/req/create-user.req.dto';
import { UpdateUserReqDto } from './dto/req/update-user.req.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  public async create(dto: CreateUserReqDto): Promise<any> {
    return await this.userRepository.save({
      email: 'asasd',
      password: 'ssdf',
      name: 'qqqq',
    });
  }

  public async findAll(): Promise<any> {
    return `This action returns all user`;
  }

  public async findOne(id: string): Promise<any> {
    return `This action returns a #${id} user`;
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserReqDto,
  ): Promise<string> {
    return `This action updates a #${id} user : ${updateUserDto}`;
  }

  public async remove(id: string): Promise<any> {
    return `This action removes a #${id} user`;
  }
}
