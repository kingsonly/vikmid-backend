import { ApiProperty } from "@nestjs/swagger";
import { Course } from "src/course/course.entity/course.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Enrollments {
    @ApiProperty({ description: 'Unique identifier for the enrollment' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Student associated with the enrollment', type: () => User })
    @ManyToOne(() => User, (user) => user.enrollments)
    @JoinColumn()
    student: User;

    @ApiProperty({ description: 'Course associated with the enrollment', type: () => Course })
    @ManyToOne(() => Course, (course) => course.enrollments)
    // @JoinColumn()
    course: Course;

    @ApiProperty({ description: 'Date of enrollment' })
    @CreateDateColumn({ type: 'timestamp' })
    enrollmentDate: Date;

    @ApiProperty({ description: 'Status of the enrollment' })
    @Column()
    status: string;

    @ApiProperty({ description: 'Date when the enrollment was created' })
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Hub ID associated with the enrollment', required: false })
    @Column({ nullable: true })
    hubId: number;

    constructor(enrollments: Partial<Enrollments>) {
        Object.assign(this, enrollments)
    }
}