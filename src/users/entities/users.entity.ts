import { Column, Entity, OneToMany } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostModel } from 'src/posts/entities/post.entity';
import { BaseModel } from 'src/common/entity/base.entity';

@Entity()
export class UsersModel extends BaseModel {
  @Column({
    length: 20,
    unique: true,
  })
  // length: 20, unique
  nickname: string;

  @Column({
    unique: true,
  })
  // unique
  email: string;

  @Column()
  //
  password: string;

  @Column({ enum: Object.values(RolesEnum), default: RolesEnum.USER })
  role: RolesEnum;

  @OneToMany(() => PostModel, (post) => post.author, {
    nullable: false,
  })
  posts: PostModel[];
}
