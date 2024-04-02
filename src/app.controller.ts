import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
// import { AppService } from './app.service';
import {
  Between,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { UserModel } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileModel } from './entity/profile.entity';
import { postModel } from './entity/post.entity';
import { TagsModel } from './entity/tag.entity';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(postModel)
    private readonly postRepository: Repository<postModel>,
    @InjectRepository(TagsModel)
    private readonly tagRepository: Repository<TagsModel>,
  ) {}

  @Get('users')
  async getAllUsers() {
    return await this.userRepository.find({
      // 관계를 가져옴.
      relations: {
        profile: true,
        posts: true,
      },
      //
      // 지정한 값만 가져옴
      // select: { id: true },
      //
      // 필터링할 조건을 입력:and 조건
      // where: { id: 1 },
      // or 조건
      // where: [{ id: 1 }, { version: 1 }],
      // 관계를 필터할 수 있음.
      // where: {
      // profile: {
      //   id: 1,
      // },
      // },
      where: {
        // 아닌경우 가져
        // id: Not(1),
        // 작은 경우
        // id: LessThan(30),
        // 작거나 같은 경우
        // id: LessThanOrEqual(30),
        // 큰 경우
        // id: MoreThan(30),
        // 크거나 같은 경우
        // id: MoreThanOrEqual(30),
        // 같은경우
        // id: Equal(30),
        // 유사값
        // email: Like('%google%'),
        // 유사값(대소문자 구분 X)
        // email: ILike('%google%'),
        // 사잇값
        // id: Between(10, 15),
        // 해당하는 모든 값
        // id: In([1, 3, 5, 7, 9]),
        // email 이 null 인 경우
        // email: IsNull(),
      },
      //
      // 오름차(ASC), 내림차(DESC)
      order: {
        // id: 'ASC',
        id: 'DESC',
      },
      // 처음 몇개를 제외
      skip: 0,
      // 몇개를 가져온다.(0:전체)
      take: 0,
    });
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    const user = this.userRepository.findOne({ where: { id: parseInt(id) } });
    if (!user) {
      throw new NotFoundException('user 정보가 없습니다.');
    }
    return user;
  }

  // @Post()
  // createUser(@Body('title') title: string) {
  //   this.userRepository.save({
  //     title,
  //   });
  // }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string, @Body('title') title: string) {
    const user = await this.getUserById(id);
    return this.userRepository.save({
      ...user,
      title,
    });
  }

  @Post('users')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'cccc@dd.com',
    });
    const profile = await this.profileRepository.save({
      profileImg: 'eeee.png',
      user,
    });
    return user;
  }

  @Post('users/posts')
  async createUsersPost() {
    const user = await this.userRepository.save({
      email: 'aaaa@ebb.com',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 1',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });
  }

  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS Lecture',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });

    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'Typescript',
      posts: [post1],
    });

    const post3 = await this.postRepository.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });

    return post3;
  }

  @Get('tags')
  getAllTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
  @Get('posts')
  getAllPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Delete('/user/profile/:id')
  async deleteByIdProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장하지 않음.
    // const user1 = this.userRepository.create({
    //   email: 'test@gmail.com',
    // });
    //
    // 겍체 생성, 저장
    // const user2 = this.userRepository.save({
    //   email: 'test@gmail.com',
    // });
    //
    // 입력된 값으로 DB를 조회한 뒤, 추가입력된 값으로 대체, 저장하지 않음.
    // const user3 = this.userRepository.preload({
    //   id: 100,
    //   email: 'change@google.com',
    // });
    //
    // 삭제
    // await this.userRepository.delete(100);
    //
    // 증가 시킴 : id :1 row count 항목 2만큼 증가
    // await this.userRepository.increment({ id: 1 }, 'count', 2);
    // 감소 시킴
    // await this.userRepository.decrement({ id: 1 }, 'count', 2);
    //
    // 카운트
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%google%'),
    //   },
    // });
    //
    // sum
    // const sum = await this.userRepository.sum('count', {
    //   email: ILike('%google%'),
    // });
    //
    // average
    // const average = this.userRepository.average('count', {
    //   id: LessThan(4),
    // });
    //
    // 최솟값
    // const min = this.userRepository.minimum('count', {
    //   id: LessThan(4),
    // });
    //
    // 최댓값
    // const max = this.userRepository.maximum('count', {
    //   id: LessThan(4),
    // });
    //
    // pagenation 전체수량을 반환해줌
    // const userAndCount = await this.userRepository.findAndCount({
    //   take: 3,
    // });
  }
}
