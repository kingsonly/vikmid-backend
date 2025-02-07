import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';


@Entity('link_in_bio_profiles')
export class LinkInBioProfile {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    userId: number;

    @Column()
    hubId: number;

    @Column()
    template: number;

    @Column()
    displayName: string;

    @Column()
    profilePicture: string;

    @Column()
    banner: string;

    @Column()
    themeColors: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.subscriptions)
    @JoinColumn({ name: 'userId' })
    user: User;

}
