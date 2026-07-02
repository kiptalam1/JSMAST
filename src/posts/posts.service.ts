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

  // new post
  create(createPostData: Omit<Post, 'id' | 'createdAt'>): Post {
    const newPost: Post = {
      id: this.getNextId(),
      ...createPostData,
      createdAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }
  // helper
  private getNextId(): number {
    return this.posts.length > 0
      ? Math.max(...this.posts.map((post) => post.id)) + 1
      : 1;
  }
  // update post;
  update(
    id: number,
    updatePostData: Partial<Omit<Post, 'id' | 'createdAt'>>,
  ): Post {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updatePostData,
      updatedAt: new Date(),
    };

    return this.posts[postIndex];
  }

  // delete post;
  remove(id: number) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} is not found`);
    }

    this.posts.splice(postIndex, 1);
    return {
      message: 'success',
    };
  }
}
