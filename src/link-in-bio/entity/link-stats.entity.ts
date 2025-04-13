import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Links } from './links.entity';

@Entity('link_stats')
export class LinkStats {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    linkId: string;

    @Column('simple-json') // or 'text' if it's stored as stringified JSON
    stats: {
        referrer: string;
        userAgent: string;
        viewportWidth: number;
        viewportHeight: number;
        language: string;
        platform: string;
    };

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Links, (link) => link.stats, { onDelete: 'CASCADE' }) // Relation to Links
    @JoinColumn({ name: 'linkId' })
    link: Links;


}