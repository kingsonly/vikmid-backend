import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { SocialLinks } from './social-links.entity';

@Entity('social_link_stats')
export class SocialLinkStats {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    socialLinkId: string;

    @Column()
    stats: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => SocialLinks, (socialLinks) => socialLinks.stats, { onDelete: 'CASCADE' }) // Relation to Links
    @JoinColumn({ name: 'linkId' })
    socialLink: SocialLinks;


}