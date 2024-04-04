import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UsersModel } from 'src/users/entities/users.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllpost(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async test_generatePosts(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
    return true;
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
