import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Hub } from 'src/hub/entities/hub.entity'; // Assuming you have a Hub entity
import { Page } from './page.entity';
import { SocialLinks } from './social-links.entity';


@Entity('bio_profile')
export class BioProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    hubId: number;

    @Column({ nullable: true })
    template: number;

    @Column({ nullable: true })
    displayName: string;

    @Column({ nullable: true })
    profilePicture: string;

    @Column({ nullable: true })
    banner: string;

    @Column({ nullable: true })
    themeColors: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Page, (page) => page.bioProfile, { cascade: true })
    pages: Page[];

    @ManyToOne(() => Hub, (hub) => hub.bioProfile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hubId' })
    hub: Hub;

    @OneToMany(() => SocialLinks, (socialLink) => socialLink.bioProfile, { cascade: true }) // Relation to SocialLinks
    socialLinks: SocialLinks[];
}
