import { Injectable } from '@nestjs/common';
import { Post } from './interfaces/post.interface';

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      title: 'First',
      content: 'First post content',
      authorName: 'Adams',
      createdAt: new Date(),
    },
  ];

  findAll(): Post[] {
    return this.posts;
  }
}
