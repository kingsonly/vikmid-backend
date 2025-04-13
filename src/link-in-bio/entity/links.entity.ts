import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { BioProfile } from 'src/link-in-bio/entity/bio-profile.entity'; // Assuming the correct path
import { PageSection } from './page_section.entity';
import { LinkStats } from './link-stats.entity';

@Entity('links')
export class Links {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    link: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    linkDesign: string;

    @Column()
    order: number;

    @Column()
    pageSectionId: string;

    @Column({ default: true })
    status: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => PageSection, (pageSection) => pageSection.links, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pageSectionId' })
    pageSection: PageSection

    @OneToMany(() => LinkStats, (linkStats) => linkStats.link, { cascade: ['remove'] }) // Relation to LinkStats
    stats: LinkStats[];


}