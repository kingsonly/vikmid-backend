import { Course } from "src/course/course.entity/course.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Enrollments {
    // The columns for the enrollment table
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.enrollments)
    student: number;

    @ManyToOne(() => Course, (course) => course.enrollments)
    course: number;

    @CreateDateColumn({type: 'timestamp'})
    enrollmentDate: Date;

    @Column()
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({nullable: true})
    hubId: number;

    // External Relationship with foreign keys
    // @ManyToOne(() => Batches, (batch) => batch.enrollments)
    // batch: number;

    constructor(enrollments: Partial<Enrollments>) {
        Object.assign(this, enrollments)
    }
}
