import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCnt: number;

  @Column()
  commentCnt: number;
}
