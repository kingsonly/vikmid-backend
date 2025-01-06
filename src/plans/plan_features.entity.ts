import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Plan } from './plans.entity';
import { Feature } from './features.entity';

@Entity('plan_features')
export class PlanFeature {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Plan)
    plan: Plan;

    @ManyToOne(() => Feature)
    feature: Feature;

    @Column()
    value: string; // Can be '10', 'true', or 'unlimited'
}
