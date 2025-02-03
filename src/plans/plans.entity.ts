import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PlanFeature } from './plan_features.entity';
@Entity('plans')
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    paymentPlanId: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(type => User, user => user.plan)
    users: User[];

    @OneToMany(() => PlanFeature, planFeature => planFeature.plan, { cascade: true })
    planFeatures: PlanFeature[];
}