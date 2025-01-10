import { Course } from "src/course/course.entity/course.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LessonSegments } from "../lesson_segments/lesson_segments.entity/lesson_segments.entity";

@Entity()
export class Lessons {
    // The columns of the contents table
        @PrimaryGeneratedColumn()
        id: number;
    
        @ManyToOne(() => Course, (course) => course.contents)
        course: Course;
    
        @Column()
        title: string;
    
        @Column('text')
        content: string;
    
        @Column()
        order: number;
    
        @CreateDateColumn({ type: 'timestamp' })
        createdAt: Date;
    
        @UpdateDateColumn({ type: 'timestamp' })
        updatedAt: Date;
    
        @Column({ nullable: true })
        hubId: number;
    
        // External relationship with foreign keys
        @OneToMany(() => LessonSegments, (lesson_segment) => lesson_segment.lesson)
        modules: LessonSegments[];
        // Student progress relationship loading...
        constructor(lessons: Partial<Lessons>) {
            Object.assign(this, lessons)
        }
}
