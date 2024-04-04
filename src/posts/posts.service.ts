import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { PostModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { after } from 'node:test';
import { HOST, PROTOCOL } from 'src/common/const/env.const';

export interface postModel {
  id: number;
  author?: string;
  title?: string;
  content?: string;
  likeCount: number;
  commentCount: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepostory: Repository<PostModel>,
  ) {}

  async getAllPosts() {
    return await this.postsRepostory.find({
      // relations: ['author'],
      relations: {
        author: true,
      },
    });
  }

  // 테스트용, 삭제예정
  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의로 생성된 Post title ${i}`,
        content: `임의로 생성된 Post content ${i}`,
      });
    }
  }

  // 1) 오름차 순으로 정렬하는 pagination 만 구현
  async paginatePosts(dto: PaginatePostDto) {
    const where: FindOptionsWhere<PostModel> = {};
    if (dto.where__id_less_than) {
      where.id = LessThan(dto.where__id_less_than);
    } else {
      where.id = MoreThan(dto.where__id_more_than);
    }

    const posts = await this.postsRepostory.find({
      where,
      order: { createdAt: dto.order__createdAt },
      take: dto.take,
    });

    const lastPost =
      posts.length > 0 && posts.length == dto.take
        ? posts[posts.length - 1]
        : null;
    const nextUrl = lastPost && new URL(`${PROTOCOL}://${HOST}/posts`);
    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }
      let key = null;
      if (dto.order__createdAt === 'ASC') {
        key = 'where__id_more_than';
      } else {
        key = 'where__id_less_than';
      }
      nextUrl.searchParams.append(key, lastPost.id.toString());
    }
    /**
     * [Reponse]
     * data: Data[],
     * cursor: {
     *    after: 마지막 Data의 ID
     * },
     * count: 응답한 데이터의 개수
     * next: 다음 요청을 할 때 사용할 URL
     */
    return {
      data: posts,
      count: posts.length,
      cursor: {
        after: lastPost?.id ?? null,
      },
      next: nextUrl?.toString() ?? null,
    };
  }

  async getPostById(id: number) {
    const post = await this.postsRepostory.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException('id 의 post가 없습니다.');
    return post;
  }

  createPost(authorId: number, postDto: CreatePostDto) {
    // [1] create
    // [2] save
    const post = this.postsRepostory.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });
    const newPost = this.postsRepostory.save(post);
    return newPost;
  }

  async updatePost(id: number, postDto: UpdatePostDto) {
    // save 기능 : 생성, 업데이트
    const post = await this.postsRepostory.findOne({ where: { id } });

    if (postDto.title) {
      post.title = postDto.title;
    }
    if (postDto.content) {
      post.content = postDto.content;
    }
    const updatePost = await this.postsRepostory.save(post);
    return updatePost;
  }

  async deletePost(postId: number) {
    const post = await this.getPostById(postId);
    await this.postsRepostory.delete(postId);
    return post;
  }
}
