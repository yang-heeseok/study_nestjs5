import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { TagsModel } from './tag.entity';

@Entity()
export class postModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserModel, (user) => user.posts)
  auther: UserModel;

  @ManyToMany(() => TagsModel, (tag) => tag.posts)
  @JoinTable()
  tags: TagsModel[];

  @Column()
  title: string;
}
