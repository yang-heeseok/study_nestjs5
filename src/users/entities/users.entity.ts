import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEnum } from '../const/rols.const';
import { postModel } from 'src/posts/posts.service';
import { PostModel } from 'src/posts/entities/posts.entity';

@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: number;

  // 1. 길이가 20을 넘지 않을 것
  // 2. unique
  @Column({
    length: 20,
    unique: true,
  })
  nickname: string;

  // 1. unique
  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Object.values(RoleEnum),
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: postModel[];
}
