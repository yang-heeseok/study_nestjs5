import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
// import { AppService } from './app.service';
import { Repository } from 'typeorm';
import { UserModel } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('users')
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  @Get()
  async getAllUsers() {
    return await this.userRepository.find();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = this.userRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      throw new NotFoundException('user 정보가 없습니다.');
    }
    return user;
  }

  @Post()
  createUser(@Body('title') title: string) {
    this.userRepository.save({
      title,
    });
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body('title') title: string) {
    const user = await this.getUserById(id);
    return this.userRepository.save({
      ...user,
      title,
    });
  }
}
