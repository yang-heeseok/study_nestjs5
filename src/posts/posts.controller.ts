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
import { PostsService } from './posts.service';

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

const posts: PostModel[] = [
  {
    id: 1,
    author: '작성자1',
    title: '제목1',
    content: '내용1',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 2,
    author: '작성자2',
    title: '제목2',
    content: '내용2',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 3,
    author: '작성자3',
    title: '제목3',
    content: '내용3',
    likeCount: 0,
    commentCount: 0,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  gotAllPosts(): PostModel[] {
    return posts;
  }

  @Get(':id')
  getPostById(@Param('id') id: string): PostModel {
    const post = posts.find((post) => post.id === +id);
    if (!post) {
      throw new NotFoundException('존재하지 않은 post입니다.');
    }
    return post;
  }

  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): PostModel {
    const res = {
      id: posts.length + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts.push(res);

    return res;
  }

  @Patch(':id')
  patchPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ): PostModel {
    const post = this.getPostById(id);
    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    return post;
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): PostModel[] {
    this.getPostById(id);
    return posts.filter((post) => post.id !== +id);
  }
}
//
