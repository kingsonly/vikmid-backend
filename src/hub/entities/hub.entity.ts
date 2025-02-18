import { BioProfile } from 'src/link-in-bio/entity/bio-profile.entity';
import { User } from 'src/users/user.entity';
import { JoinColumn, OneToOne, Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';


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

    @OneToOne(() => BioProfile, (bioProfile) => bioProfile.hub, { cascade: true, onDelete: 'CASCADE' })
    bioProfile: BioProfile;
}
