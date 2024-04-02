import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { postModel } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  // @PrimaryColumn()
  // @PrimaryGeneratedColumn('uuid')
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  /* @Column({
      // 데이터 베이스에서 인지하는 column type
      // 자동 유추
      type: 'varchar',
      // 데이터베이스 column name
      // property name 으로 자동 유추
      name: 'title',
      // value length
      length: 300,
      nullable: false,
      update: false,
      // find 에서 기본적으로 가져올 값
      // 기본값이 true
      select: true,
      // 기본값 : 기본적으로 입력되어야 하는 값
      default: 'default value',
      // ex) email
      unique: false,
    })
    title: string; */

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @VersionColumn()
  version: number;

  @Column()
  @Generated('increment')
  additionId: number;

  @OneToOne(() => ProfileModel, (profile) => profile.user, {
    // find() 실행 할때마다 항상 같이 가져올 relation
    eager: false,
    // 저장할때 relation을 한번에 같이 저장가능
    cascade: true,
    // null 이 가능한지
    nullable: true,
    // 관계가 삭제 되었을 때
    // NO ACTION : nothing TO DO
    // CASCADE : 참조하는 Row도 같이 삭제
    // set null : 참조하는 Row에서 참조 id를 null로 변경
    // set default : 기본 셋팅으로 설정 (테이블의 기본 셋팅)
    // RESTRICT : 참조하고 있는 Row가 있는 경우 참조당하는 Row 삭제 불가
    onDelete: 'NO ACTION',
  })
  profile: ProfileModel;

  @OneToMany(() => postModel, (post) => post.auther, {
    eager: false,
  })
  posts: postModel[];

  @Column()
  count: number;
}
