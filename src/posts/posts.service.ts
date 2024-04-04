import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
