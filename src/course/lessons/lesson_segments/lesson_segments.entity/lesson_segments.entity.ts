import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Lessons } from "../../lessons.entity/lessons.entity";
import { ApiProperty } from "@nestjs/swagger";
import { text } from "stream/consumers";

@Entity()
export class LessonSegments {
    @ApiProperty({ description: 'Unique identifier for the lesson segment' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => Lessons, description: 'The lesson associated with this segment' })
    @ManyToOne(() => Lessons, (lesson) => lesson.lessonSegments, { eager: true })
    lesson: Lessons;

    @ApiProperty({ description: 'Type of the lesson segment' })
    @Column()
    type: string;

    @ApiProperty({ description: 'Content of the lesson segment', type: text })
    @Column('text')
    content: string;

    @ApiProperty({ description: 'Type of the lesson content', enum: ['pdf', 'engagement', 'poll', 'video', 'text'] })
    @Column({ type: 'enum', enum: ['pdf', 'engagement', 'poll', 'video', 'text'], default: 'text' })
    contentType: string;

    @ApiProperty({ description: 'Description of the lesson segment', type: text })
    @Column('text')
    description: string;

    @ApiProperty({ description: 'Order of the lesson segment' })
    @Column()
    order: number;

    @ApiProperty({ description: 'Timestamp when the lesson segment was created' })
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Timestamp when the lesson segment was last updated' })
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ApiProperty({ description: 'Optional hub identifier', example: "1jjheudfvw892829202bdjwjjw"})
    @Column('text')
    hubId: string;

    @ApiProperty({ description: 'Indicates if the lesson segment is free' })
    @Column()
    status: boolean;

    @ApiProperty({ description: 'Indicates if the lesson segment is previewable' })
    @Column()
    previewable: boolean;

    // External Relationship with foreign keys
    // mou_engagements relationship loading...
    // student_progress relationships loading...

    constructor(lessonSegments: Partial<LessonSegments>) {
        Object.assign(this, lessonSegments)
    }
}