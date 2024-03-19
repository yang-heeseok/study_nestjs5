import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';

@Controller('users')
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  @Get()
  async getUsers() {
    return await this.userRepository.find();
  }

  @Post()
  async createUser() {
    return await this.userRepository.save({ title: 'title1' });
  }

  // @Patch(':id')
  // async updateUser(@Param('id') id: string) {
  //   const user = await this.userRepository.findOne({
  //     where: { id: parseInt(id) },
  //   });
  //   return await this.userRepository.save({
  //     ...user,
  //     title: 'update title',
  //   });
  // }
}
