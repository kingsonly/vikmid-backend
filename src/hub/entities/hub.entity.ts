import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('hubs')
export class Hub {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: number;

    @Column()
    title: string;

    @Column()
    hubUrl: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
