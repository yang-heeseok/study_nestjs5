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
import { PostModel, PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  gotAllPosts(): PostModel[] {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string): PostModel {
    return this.postsService.getPostById(+id);
  }

  @Post()
  createPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): PostModel {
    return this.postsService.createPost(author, title, content);
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ): PostModel {
    return this.postsService.updatePost(+id, author, title, content);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string): PostModel[] {
    return this.postsService.deletePost(+id);
  }
}
//
