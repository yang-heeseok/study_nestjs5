import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,
  ) {}

  async createUser(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
    // 1) nickname 중복 확인
    const nicknameExists = await this.userRepository.exists({
      where: { nickname: user.nickname },
    });
    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 nickname 입니다.');
    }

    const emailExists = await this.userRepository.exists({
      where: { email: user.email },
    });
    if (emailExists) {
      throw new BadRequestException('이미 존재하는 eamil 입니다.');
    }

    const userObject = this.userRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });
    const newUser = this.userRepository.save(userObject);
    return newUser;
  }

  async getAllUser() {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }
}
