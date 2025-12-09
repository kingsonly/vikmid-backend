import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Lessons } from "../lessons/lessons.entity/lessons.entity";
import { Enrollments } from "../enrollments/enrollments.entity/enrollments.entity";
import { ApiProperty } from "@nestjs/swagger";

export enum CourseType {
    ON_DEMAND = 'on-demand',
    COHORT = 'cohort',
    CHALLENGE = 'challenge',
}

class EnrollmentQuestion {
    question: string;
    required: boolean;
    type: 'text' | 'multiple_choice' | 'checkbox';
    options?: string[];
}

@Entity()
export class Course {
    @ApiProperty({ description: 'Unique identifier for the course', example: 1 })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Course creator', type: () => User })
    @ManyToOne(() => User, (user) => user.courses, { eager: true })
    creator: User;

    @ApiProperty({ description: 'Title of the course', example: 'NestJS for Beginners' })
    @Column()
    title: string;

    @ApiProperty({ description: 'Description of the course', example: 'A comprehensive course on NestJS' })
    @Column('text')
    description: string;

    @ApiProperty({ description: 'Price of the course', example: 100.50 })
    @Column({ type: 'decimal', nullable: true })
    price?: number;

    @ApiProperty({ description: 'Course status (active/inactive)', example: 'active' })
    @Column({ default: false })
    status: boolean;

    @ApiProperty({ description: 'Course creation timestamp', example: '2022-01-01T00:00:00Z' })
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Course last update timestamp', example: '2022-01-02T00:00:00Z' })
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ApiProperty({ description: 'Indicates whether the course has a trailer', example: true })
    @Column({ default: false })
    withTrailer: boolean;

    @ApiProperty({ description: 'The type of course being created', example: "on-demand" })
    @Column({
        type: 'enum',
        enum: CourseType,
    })
    courseType: CourseType;

    @ApiProperty({ description: 'Indicates whether the course has a discount', example: true })
    @Column({ default: false })
    withDiscount: boolean;

    @ApiProperty({
        description: 'Enrollment questions shown before registration',
        example: [
            {
                question: "Why are you taking this course?",
                required: true,
                type: "text",
            },
            {
                question: "What topics are you interested in?",
                required: false,
                type: "multiple_choice",
                options: ["Tech", "Design", "Business"],
            },
        ],
    })
    @Column({ type: 'simple-json', nullable: true })
    enrollmentQuestions?: EnrollmentQuestion[];

    @ApiProperty({ description: 'Discounted price of the course', example: 80.00 })
    @Column({ type: 'decimal', nullable: true })
    discountPrice?: number;

    @ApiProperty({ description: 'File associated with the course (e.g., a trailer video)', example: 'file.mp4', nullable: true })
    @Column({ nullable: true })
    file: string;

    @ApiProperty({ description: 'Indicates whether the course has a batch', example: true })
    @Column({ default: false })
    withBatch: boolean;

    @ApiProperty({ description: 'Indicates whether the course has a certificate', example: true })
    @Column({ default: false })
    withCertificate: boolean;

    @ApiProperty({ description: 'ID of the hub related to the course', example: "1jjheudfvw892829202bdjwjjw" })
    @Column()
    hubId: number;

    @ApiProperty({ description: 'Lessons associated with this course.', type: () => [Lessons] })
    @OneToMany(() => Lessons, (lesson) => lesson.course, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    lessons: Lessons[];

    @ApiProperty({ description: 'Enrollments associated with this course.', type: () => [Enrollments] })
    @OneToMany(() => Enrollments, (enrollment) => enrollment.course, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    enrollments: Enrollments[];

    constructor(course: Partial<Course>) {
        Object.assign(this, course)
    }
}