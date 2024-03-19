import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';

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
  //   @Column({
  //     type: 'varchar',
  //     name: 'ttiittllee',
  //     length: 300,
  //     nullable: true,
  //     update: false,
  //     select: false,
  //     default: 'default value',
  //     unique: false,
  //   })
  //   title: string;

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

  @VersionColumn() // save가 몇번 실행되었는지 체크
  version: number;

  // @Generated('uuid')
  // additionalId: string;
  @Column()
  @Generated('increment')
  additionalId: number;

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  profile: ProfileModel;
}
