import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly appService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.appService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.appService.getPostById(+id);
  }

  @Post()
  createPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.appService.createPost(author, title, content);
  }

  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.appService.updatePost(+id, author, title, content);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.appService.deletePost(+id);
  }
}
