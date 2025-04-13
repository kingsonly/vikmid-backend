import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { PageSection } from './page_section.entity';
import { BioProfile } from './bio-profile.entity';

@Entity('page')
export class Page {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: "home" })
    name: string;

    @ManyToOne(() => BioProfile, (bioProfile) => bioProfile.pages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bioProfileId' })
    bioProfile: BioProfile;

    @Column()
    bioProfileId: string;

    @Column({ default: true })
    status: boolean;

    @Column()
    order: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => PageSection, (pageSection) => pageSection.page, { cascade: ['remove'] })
    sections: PageSection[];
}