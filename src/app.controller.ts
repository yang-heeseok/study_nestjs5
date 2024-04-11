import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface PostModel {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Controller('post')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): PostModel {
    return {
      author: 'author_1',
      title: 'title_1',
      content: 'content_1',
      likeCount: 0,
      commentCount: 0,
    };
  }
}
