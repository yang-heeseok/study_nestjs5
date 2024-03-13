import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,
  ) {}

  async createUser(nickname: string, email: string, password: string) {
    const user = this.userRepository.create({
      nickname,
      email,
      password,
    });
    const newUser = this.userRepository.save(user);
    return newUser;
  }

  async getAllUser() {
    return await this.userRepository.find();
  }
}
