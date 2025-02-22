import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { BioProfile } from 'src/link-in-bio/entity/bio-profile.entity'; // Assuming the correct path
import { Page } from './page.entity';
import { Links } from './links.entity';

@Entity('page_section')
export class PageSection {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    pageId: string;

    @Column({ default: true })
    status: boolean;
    @Column()
    order: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Page, (page) => page.sections, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'pageId' })
    page: Page;

    @OneToMany(() => Links, (links) => links.pageSection, { cascade: ['remove'] })
    links: Links[]
}