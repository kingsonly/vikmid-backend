import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('features')
export class Feature {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    key: string;

    @Column()
    type: string; // limit, boolean, etc.

    @Column()
    description: string;
}
