import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Lessons } from "../../lessons.entity/lessons.entity";

@Entity()
export class LessonSegments {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Lessons, (lesson) => lesson.lessonSegments, {eager:true})
    lesson: Lessons;

    @Column()
    type: string;

    @Column('text')
    content: string;

    @Column('text')
    description: string;

    @Column()
    order: number;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @Column({nullable: true})
    hubId: number;

    @Column()
    freeStatus: boolean;

    @Column()
    previewable: boolean;

    // External Relationship with foreign keys
    // mou_engagements relationship loading...
    // student_progress relationships loading...

    constructor(lessonSegments: Partial<LessonSegments>) {
        Object.assign(this, lessonSegments)
    }
}
