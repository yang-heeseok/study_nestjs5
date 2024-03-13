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
    return await this.postRepository.find();
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

  async updatePost(
    postId: number,
    author: string,
    title: string,
    content: string,
  ) {
    const post = await this.getPostById(postId);
    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    const newPost = await this.postRepository.save(post);
    return newPost;
  }

  async deletePost(postId: number) {
    await this.getPostById(postId);
    await this.postRepository.delete(postId);
  }
}
