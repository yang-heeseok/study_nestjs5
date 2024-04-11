import { Injectable, NotFoundException } from '@nestjs/common';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'author_1',
    title: 'title_1',
    content: 'content_1',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 2,
    author: 'author_2',
    title: 'title_2',
    content: 'content_2',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 3,
    author: 'author_3',
    title: 'title_3',
    content: 'content_3',
    likeCount: 0,
    commentCount: 0,
  },
];

@Injectable()
export class PostsService {
  getAllPosts() {
    return posts;
  }

  getPostById(id: number) {
    const post = posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException(`post 가 없습니다.`);
    }
    return post;
  }

  createPost(author: string, title: string, content: string) {
    const newPost = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts.push(...posts, newPost);
  }

  updatePost(id: number, author?: string, title?: string, content?: string) {
    const post = this.getPostById(id);
    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;
    posts = posts.map((prePost) => (prePost.id === id ? post : prePost));
    return post;
  }

  deletePost(id: number) {
    this.getPostById(id);
    posts = posts.filter((post) => post.id !== +id);
    return posts;
  }
}
