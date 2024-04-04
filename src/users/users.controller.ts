import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // createUser(
  //   @Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.createUser({ nickname, email, password });
  // }

  @Get()
  /**
   * serialization => 직렬화 => 현재 시스템(NestJs)에서 사용되는 데이터의 구조를 다른 시스템에서 쉽게 사용할 수 있는 포맷으로 변환
   *  class의 object => JSON 포맷으로 변환
   * deserialization => 역직렬화
   */
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}
