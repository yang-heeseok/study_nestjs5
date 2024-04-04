import { PickType } from '@nestjs/mapped-types';
import { PostModel } from '../entities/posts.entity';

// DTO : Data Transfer Object
// export class CreatePostDto {
//   @IsString({
//     message: 'title은 string 타입을 입력 해줘야 합니다.',
//   })
//   title: string;

//   @IsString({
//     message: 'content는 string 타입을 입력해줘야 합니다.',
//   })
//   content: string;
// }

// TypeScript
// Pick, Omit, Partial => Type 반환
// PickType, OmitType, PartialType => 값을 반환
export class CreatePostDto extends PickType(PostModel, ['title', 'content']) {}
