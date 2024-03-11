import { Injectable, NotFoundException } from '@nestjs/common';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCnt: number;
  commentCnt: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans~~',
    title: 'newjeans minji',
    content: 'edit makeup',
    likeCnt: 10000000000,
    commentCnt: 999,
  },
  {
    id: 2,
    author: 'newjeans~~',
    title: 'newjeans minji',
    content: 'edit makeup',
    likeCnt: 10000000000,
    commentCnt: 999,
  },
  {
    id: 3,
    author: 'newjeans~~',
    title: 'newjeans minji',
    content: 'edit makeup',
    likeCnt: 10000000000,
    commentCnt: 999,
  },
];

@Injectable()
export class PostsService {
  getAllposts(): PostModel[] {
    return posts;
  }

  getPostById(id: string): PostModel {
    const post = posts.find((post) => post.id === +id);
    if (!post) {
      throw new NotFoundException();
    } else {
      return post;
    }
  }

  createPost(author: string, title: string, content: string): PostModel {
    const post = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCnt: 0,
      commentCnt: 0,
    };
    posts.push(post);
    return post;
  }

  updatePost(
    id: string,
    author?: string,
    title?: string,
    content?: string,
  ): PostModel {
    const post = this.getPostById(id);
    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    posts = posts.map((e) => (e.id === +id ? post : e));
    return post;
  }

  deletePost(id: string): PostModel {
    const post = this.getPostById(id);
    posts = posts.filter((e) => e.id !== +id);
    return post;
  }
}
