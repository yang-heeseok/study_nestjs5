import { Column, Entity, OneToMany } from 'typeorm';
import { RoleEnum } from '../const/rols.const';
import { postModel } from 'src/posts/posts.service';
import { PostModel } from 'src/posts/entities/posts.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { Exclude, Expose } from 'class-transformer';

/**
 * class 전체를 @Exclude 처리 : 기본값으로 모두 비공개
 * 공개하고 싶은 항목만 @Expose 처리
 */

@Entity()
export class UsersModel extends BaseModel {
  // 1. 길이가 20을 넘지 않을 것
  // 2. unique
  @Column({
    length: 20,
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @Expose()
  get nicknameAndEmail() {
    return this.nickname + ' / ' + this.email;
  }

  // 1. unique
  @Column({
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  /**
   * [Request]
   * frontend => backend
   * plain object (JSON) => class instance (dto)
   *
   * [Response]
   * backend => frontend
   * class instance (dto) => plain object (JSON)
   *
   * toClassOnly => class instance 로 변환될 때만
   * toPlainOnly => plain object 로 변환될 때만
   */
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({
    enum: Object.values(RoleEnum),
    default: RoleEnum.USER,
  })
  role: RoleEnum;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: postModel[];
}
