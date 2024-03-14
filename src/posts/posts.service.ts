import { Injectable, NotFoundException } from '@nestjs/common';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

const posts: PostModel[] = [
  {
    id: 1,
    author: '작성자1',
    title: '제목1',
    content: '내용1',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 2,
    author: '작성자2',
    title: '제목2',
    content: '내용2',
    likeCount: 0,
    commentCount: 0,
  },
  {
    id: 3,
    author: '작성자3',
    title: '제목3',
    content: '내용3',
    likeCount: 0,
    commentCount: 0,
  },
];

@Injectable()
export class PostsService {
  getAllPosts(): PostModel[] {
    return posts;
  }

  getPostById(id: number) {
    const post = posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException('존재하지 않은 post입니다.');
    }
    return post;
  }

  createPost(author: string, title: string, content: string): PostModel {
    const newPost = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts.push(newPost);
    return newPost;
  }

  updatePost(id: number, author: string, title: string, content: string) {
    const post = this.getPostById(id);
    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;
    return post;
  }

  deletePost(id: number) {
    this.getPostById(id);
    return posts.filter((post) => post.id !== id);
  }
}
