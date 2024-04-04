import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseModel {
  @Exclude({ toPlainOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude({ toPlainOnly: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @CreateDateColumn()
  createdAt: Date;
}
