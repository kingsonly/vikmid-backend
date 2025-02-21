import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { BioProfile } from 'src/link-in-bio/entity/bio-profile.entity'; // Assuming the correct path
import { SocialLinkStats } from './social-link-stats.entity';

@Entity('social_links')
export class SocialLinks {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    socialNetworkName: string;

    @Column()
    bioProfileId: string;

    @Column()
    link: string;

    @Column()
    order: number;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => SocialLinkStats, (socialLinkStats) => socialLinkStats.socialLink, { cascade: true }) // Relation to LinkStats
    stats: SocialLinkStats[];

    @ManyToOne(() => BioProfile, (bioProfile) => bioProfile.socialLinks, { onDelete: 'CASCADE' }) // Relation to BioProfile
    @JoinColumn({ name: 'bioProfileId' })
    bioProfile: BioProfile;


}