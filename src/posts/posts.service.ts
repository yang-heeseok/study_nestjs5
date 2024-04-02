import { Injectable, NotFoundException } from '@nestjs/common';

export interface postModel {
  id: number;
  author?: string;
  title?: string;
  content?: string;
  likeCount: number;
  commentCount: number;
}

let posts: postModel[] = [
  {
    id: 1,
    author: 'string_1',
    title: 'string_1',
    content: 'string_1',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 2,
    author: 'string_2',
    title: 'string_2',
    content: 'string_2',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 3,
    author: 'string_3',
    title: 'string_3',
    content: 'string_3',
    likeCount: 0,
    commentCount: 0,
  },
];

@Injectable()
export class PostsService {
  getAllPosts(): postModel[] {
    return posts;
  }

  getPostById(id: number): postModel {
    const post = posts.find((post) => post.id == id);
    if (!post) {
      throw new NotFoundException('id 의 post가 없습니다.');
    }
    return post;
  }

  createPost(author: string, title: string, content: string): postModel {
    const post = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts.push(post);
    return post;
  }

  updatePost(id: number, author: string, title: string, content: string) {
    const post: postModel = this.getPostById(id);
    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }
    posts.map((prePost) => (prePost.id == +id ? post : prePost));
    return post;
  }

  deletePost(id: number) {
    const post = this.getPostById(id);
    posts = posts.filter((post) => post.id !== +id);
    return post;
  }
}
