import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllpost() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  createPost(
    // @Body('authorId') authorId: number,
    // @Request() req: any,
    @User('id') userId: number,
    // @Body('title') title: string,
    // @Body('content') content: string,
    @Body() body: CreatePostDto,
    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    return this.postsService.createPost(userId, body);
  }

  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe) userId: number,
    // @Body('title') title: string,
    // @Body('content') content: string,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(userId, body);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
