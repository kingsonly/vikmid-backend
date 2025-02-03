import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';


@Entity('creators_subscriptions')
export class CreatorsSubscription {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    planId: number;

    @Column({ default: 'active' })
    status: string;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.subscriptions)
    //@JoinColumn({ name: 'userId' })
    user: User;

}
