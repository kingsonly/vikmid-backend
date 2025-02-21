import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Links } from './links.entity';

@Entity('link_stats')
export class LinkStats {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    linkId: string;

    @Column()
    stats: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Links, (link) => link.stats, { onDelete: 'CASCADE' }) // Relation to Links
    @JoinColumn({ name: 'linkId' })
    link: Links;


}