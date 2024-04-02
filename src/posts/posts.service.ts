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

let posts: postModel[] = [
  {
    id: 1,
    author: 'string_1',
    title: 'string_1',
    content: 'string_1',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 2,
    author: 'string_2',
    title: 'string_2',
    content: 'string_2',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 3,
    author: 'string_3',
    title: 'string_3',
    content: 'string_3',
    likeCount: 0,
    commentCount: 0,
  },
];

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepostory: Repository<PostModel>,
  ) {}

  async getAllPosts() {
    return await this.postsRepostory.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepostory.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('id 의 post가 없습니다.');
    }
    return post;
  }

  createPost(author: string, title: string, content: string) {
    // [1] create
    // [2] save
    const post = this.postsRepostory.create({
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });
    const newPost = this.postsRepostory.save(post);
    return newPost;
  }

  async updatePost(id: number, author: string, title: string, content: string) {
    // save 기능 : 생성, 업데이트
    const post = await this.postsRepostory.findOne({ where: { id } });
    if (author) {
      post.author = author;
    }
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
