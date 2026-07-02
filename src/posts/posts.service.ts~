import { Injectable, NotFoundException } from '@nestjs/common';
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
  // one post
  findOne(id: number): Post {
    const single = this.posts.find((post) => post.id === id);
    if (!single) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }
    return single;
  }
}
