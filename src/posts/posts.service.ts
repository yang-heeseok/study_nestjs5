import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

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

  createPost(authorId: number, title: string, content: string) {
    // [1] create
    // [2] save
    const post = this.postsRepostory.create({
      author: {
        id: authorId,
      },
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });
    const newPost = this.postsRepostory.save(post);
    return newPost;
  }

  async updatePost(id: number, title: string, content: string) {
    // save 기능 : 생성, 업데이트
    const post = await this.postsRepostory.findOne({ where: { id } });

    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
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
