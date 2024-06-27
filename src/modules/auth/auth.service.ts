import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
// import { CreateAuthReqDto } from './dto/req/create-auth.req.dto';
// import { UpdateAuthReqDto } from './dto/req/update-auth.req.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  // create(createAuthDto: CreateAuthReqDto) {
  //   return 'This action adds a new auth';
  // }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
  //
  // update(id: number, updateAuthDto: UpdateAuthReqDto) {
  //   return `This action updates a #${id} auth`;
  // }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
