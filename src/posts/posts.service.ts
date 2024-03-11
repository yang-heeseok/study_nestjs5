import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
  ) {}

  async getAllPosts() {
    return this.postRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException();
    } else {
      return post;
    }
  }

  async createPost(author: string, title: string, content: string) {
    const post = this.postRepository.create({
      author,
      title,
      content,
      likeCnt: 0,
      commentCnt: 0,
    });
    const newPost = await this.postRepository.save(post);
    return newPost;
  }

  //   updatePost(
  //     id: string,
  //     author?: string,
  //     title?: string,
  //     content?: string,
  //   ): PostModel {
  //     const post = this.getPostById(id);
  //     if (author) post.author = author;
  //     if (title) post.title = title;
  //     if (content) post.content = content;

  //     posts = posts.map((e) => (e.id === +id ? post : e));
  //     return post;
  //   }

  //   deletePost(id: string): PostModel {
  //     const post = this.getPostById(id);
  //     posts = posts.filter((e) => e.id !== +id);
  //     return post;
  //   }
}
