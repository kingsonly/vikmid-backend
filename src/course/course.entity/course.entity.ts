import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Lessons } from "../lessons/lessons.entity/lessons.entity";
import { Enrollments } from "../enrollments/enrollments.entity/enrollments.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Course {
    @ApiProperty({ description: 'Unique identifier for the course', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

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
    @Column('decimal')
    price: number;

    @ApiProperty({ description: 'Course status (active/inactive)', example: 'active' })
    @Column()
    status: string;

    @ApiProperty({ description: 'Course creation timestamp', example: '2022-01-01T00:00:00Z' })
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Course last update timestamp', example: '2022-01-02T00:00:00Z' })
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ApiProperty({ description: 'Indicates whether the course has a trailer', example: true })
    @Column({ default: false })
    withTrailer: boolean;

    @ApiProperty({ description: 'Indicates whether the course has a discount', example: true })
    @Column({ default: false })
    withDiscount: boolean;

    @ApiProperty({ description: 'Discounted price of the course', example: 80.00 })
    @Column('decimal')
    discountPrice: number;

    @ApiProperty({ description: 'File associated with the course (e.g., a trailer video)', example: 'file.mp4', nullable: true })
    @Column({ nullable: true })
    file: string;

    @ApiProperty({ description: 'Indicates whether the course has a batch', example: true })
    @Column({ default: false })
    withBatch: boolean;

    @ApiProperty({ description: 'Indicates whether the course has a certificate', example: true })
    @Column({ default: false })
    withCertificate: boolean;

    @ApiProperty({ description: 'ID of the hub related to the course', example: 1, nullable: true })
    @Column({ nullable: true })
    hubId: number;

    @ApiProperty({ description: 'Lessons associated with this course.', type: () => [Lessons] })
    @OneToMany(() => Lessons, (lesson) => lesson.course)
    lessons: Lessons[];

    @ApiProperty({ description: 'Enrollments associated with this course.', type: () => [Enrollments]})
    @OneToMany(() => Enrollments, (enrollment) => enrollment.course)
    enrollments: Enrollments[];

    constructor(course: Partial<Course>) {
        Object.assign(this, course)
    }
}
