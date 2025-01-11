import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Lessons } from "../lessons/lessons.entity/lessons.entity";
import { Enrollments } from "../enrollments/enrollments.entity/enrollments.entity";

@Entity()
export class Course {
    // Table columns of the course table
    @PrimaryGeneratedColumn()
    id: number;

    // Internal relationship with external primary keys
    @ManyToOne(() => User, (user) => user.courses, { eager: true })
    creator: User;

    @Column()
    title: string;

    @Column('text') // Using 'text' for longer descriptions
    description: string;

    @Column('decimal')
    price: number;

    @Column()
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ default: false })
    withTriller: boolean;

    @Column({ nullable: true }) // Nullable in case triller is not provided
    triller: string;

    @Column({ default: false })
    withBatch: boolean;

    @Column({ default: false })
    withCertificate: boolean;

    @Column({ nullable: true })
    hubId: number;

    // External Relationships with foreign keys
    @OneToMany(() => Lessons, (lesson) => lesson.course)
    lessons: Lessons[];

    @OneToMany(() => Enrollments, (enrollment) => enrollment.course)
    enrollments: Enrollments[];

    constructor(course: Partial<Course>) {
        Object.assign(this, course)
    }
}
