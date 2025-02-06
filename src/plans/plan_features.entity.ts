import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @ManyToOne(() => Plan, plan => plan.planFeatures, { onDelete: 'CASCADE' })
    // plan: Plan;

    // @ManyToOne(() => Feature, feature => feature.planFeatures, { onDelete: 'CASCADE' })
    // feature: Feature;
}
