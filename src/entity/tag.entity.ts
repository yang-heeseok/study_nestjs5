import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { postModel } from './post.entity';

@Entity()
export class TagsModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => postModel, (post) => post.tags)
  posts: postModel[];

  @Column()
  name: string;
}
