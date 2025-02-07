import { Course } from "src/course/course.entity/course.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LessonSegments } from "../lesson_segments/lesson_segments.entity/lesson_segments.entity";
import { ApiProperty } from "@nestjs/swagger";
import { text } from "stream/consumers";

@Entity()
export class Lessons {
    @ApiProperty({ description: 'Unique identifier for the lesson.' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The course associated with the lesson.', type: () => Course })
    @ManyToOne(() => Course, (course) => course.lessons, { eager: true })
    course: Course;

    @ApiProperty({ description: 'Title of the lesson.' })
    @Column()
    title: string;

    @ApiProperty({ description: 'Content of the lesson.', type: text })
    @Column('text')
    content: string;

    @ApiProperty({ description: 'Order of the lesson within the course.' })
    @Column()
    order: number;

    @ApiProperty({ description: 'The date when the lesson was created.' })
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'The date when the lesson was last updated.' })
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ApiProperty({ description: 'Hub identifier for the lesson.', default: 0 })
    @Column({ default: 0 })
    hubId: number;

    @ApiProperty({ description: 'Segments associated with this lesson.', type: () => [LessonSegments] })
    // @OneToMany(() => LessonSegments, (lesson_segment) => lesson_segment.lesson)
    // lessonSegments: LessonSegments[];
    @OneToMany(() => LessonSegments, (lesson_segment) => lesson_segment.lesson, { cascade: true, onDelete: 'CASCADE' })
    lessonSegments: LessonSegments[];

    // Student progress relationship loading...
    constructor(lessons: Partial<Lessons>) {
        Object.assign(this, lessons)
    }
}
