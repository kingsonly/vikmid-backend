import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PlanFeature } from './plan_features.entity';
@Entity('features')
export class Feature {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    key: string;

    @Column()
    type: string; // limit, boolean, etc.

    @Column()
    description: string;
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => PlanFeature, planFeature => planFeature.feature, { cascade: true })
    planFeatures: PlanFeature[];
}
