import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

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

  @Column({
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
  title: string;

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
}
