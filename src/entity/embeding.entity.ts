import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Name {
  @Column()
  firstname: string;

  @Column()
  lastname: string;
}
@Entity()
export class StudentModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  school: string;
}
@Entity()
export class TeacherModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => Name)
  name: Name;

  @Column()
  salary: number;
}
