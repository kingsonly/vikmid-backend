import { Course } from 'src/course/course.entity/course.entity';
import { Enrollments } from 'src/course/enrollments/enrollments.entity/enrollments.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  // The columns of the users table
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  planId: number;

  // External Relationship to foreign keys
  @OneToMany(() => Course, (course) => course.creator)
  courses: Course[];
  
  @OneToMany(() => Enrollments, (enrollment) => enrollment.student)
  enrollments: Enrollments[];
}
