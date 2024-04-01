import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface postModel {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): postModel {
    return {
      author: 'string',
      title: 'string',
      content: 'string',
      likeCount: 0,
      commentCount: 0,
    };
  }
}
