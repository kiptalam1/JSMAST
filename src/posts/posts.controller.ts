import { Controller, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './interfaces/post.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  // fetch all posts;
  @Get()
  findAll(@Query('search') search?: string): Post[] {
    const extracts = this.postsService.findAll();
    if (search) {
      return extracts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return extracts;
  }
}
