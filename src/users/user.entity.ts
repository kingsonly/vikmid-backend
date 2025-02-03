import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToMany, ManyToOne, UpdateDateColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { Plan } from 'src/plans/plans.entity';
import { CreatorsSubscription } from 'src/creators-subscription/entities/creators-subscription.entity';

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

  @ManyToOne(() => Plan, (plan) => plan.users)
  @JoinColumn({ name: 'planId' })
  plan: Plan;
}
