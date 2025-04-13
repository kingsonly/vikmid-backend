import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToMany, ManyToOne, UpdateDateColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { Plan } from 'src/plans/plans.entity';
import { CreatorsSubscription } from 'src/creators-subscription/entities/creators-subscription.entity';
import { Course } from 'src/course/course.entity/course.entity';
import { Enrollments } from 'src/course/enrollments/enrollments.entity/enrollments.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isCreator: boolean;

  @Column()
  planId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CreatorsSubscription, (creatorsSubscription) => creatorsSubscription.user)
  subscriptions: CreatorsSubscription[];

  
  // External Relationship to foreign keys
  @OneToMany(() => Course, (course) => course.creator)
  courses: Course[];

  @OneToMany(() => Enrollments, (enrollment) => enrollment.student)
  enrollments: Enrollments[];

  @ManyToOne(() => Plan, (plan) => plan.users)
  @JoinColumn({ name: 'planId' })
  plan: Plan;
}
