import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonSegments } from './lesson_segments.entity/lesson_segments.entity';
import { LessonsService } from '../lessons.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateLessonSegmentsDto } from './dto/create-lesson_segments.dto';
import { UpdateLessonSegmentsDto } from './dto/update-lesson_segments.dto';

@Injectable()
export class LessonSegmentsService {
    constructor(
        // The lesson repository for getting data from db4
        @InjectRepository(LessonSegments)
        private readonly lessonSegmentsRepository: Repository<LessonSegments>,

        // The entity manager for sending data to db 
        private readonly entityManager: EntityManager,

        // The course service
        private readonly lessonsService: LessonsService,
    ) {}

    async findAll(lessonId: number): Promise<any> {
        const lessonSegments = await this.lessonSegmentsRepository.find({
            where: {lesson: {id: lessonId}},
            relations: ['lesson'],
        });

        if (lessonSegments.length === 0) {
            throw new NotFoundException("There are no segments for this lesson");
        }

        return lessonSegments.map(lessonSegment => {
            return {
                ...lessonSegment,
                lessonId: lessonSegment.lesson.id, // Accessing the lesson ID directly
            };
        });
    }

    async findOne(lesonId: number, lessonSegmentId: number): Promise<LessonSegments> {
        const lessonSegment = await this.lessonSegmentsRepository.findOne({
            where: {id: lessonSegmentId, lesson: {id: lesonId}},
            relations: ['lesson'],
        });

        if (!lessonSegment) {
            throw new NotFoundException("Lesson segment not found in this lesson");
        }

        return lessonSegment;
    }

    async findAnyOne(lessonSegmentId: number): Promise<LessonSegments> {
        const lessonSegment = await this.lessonSegmentsRepository.findOne({
            where: {id: lessonSegmentId},
            relations: ['lesson'],
        });

        if (!lessonSegment) {
            throw new NotFoundException("LessonSegment not found");
        }

        return lessonSegment;
    }

    async create(lessonSegmentDto: CreateLessonSegmentsDto): Promise<LessonSegments> {
        // Fetch the lesson based on the provided lessonId
        const lesson = await this.lessonsService.findOneById(lessonSegmentDto.lessonId);
        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }
    
        // Create the lessonSegment entity and assign the lesson relationship
        const lessonSegment = this.lessonSegmentsRepository.create({ 
            ...lessonSegmentDto, 
            lesson: lesson
        });
    
        // Save the lesson using the repository instead of the entityManager
        const savedLessonSegment = await this.lessonSegmentsRepository.save(lessonSegment);
    
        // Return the saved lesson with the lessonId included
        return {
            ...savedLessonSegment,
            lessonId: savedLessonSegment.lesson.id
        } as LessonSegments;
    }

    async update(lessonSegmentId: number, lessonSegmentDto: UpdateLessonSegmentsDto): Promise<LessonSegments> {
        // Find the existing lessonSegment by ID
        const lessonSegment = await this.lessonSegmentsRepository.findOne({ where: { id: lessonSegmentId }, relations: ['lesson'] });
        if (!lessonSegment) {
            throw new NotFoundException('Lesson segment not found');
        }

        // If the lessonId is provided and needs to be updated
        if (lessonSegmentDto.lessonId) {
            const lesson = await this.lessonsService.findOneById(lessonSegmentDto.lessonId);
            if (!lesson) {
                throw new NotFoundException('Lesson not found');
            }
            lessonSegment.lesson = lesson;
        }

        // Update only the provided fields
        Object.assign(lessonSegment, lessonSegmentDto);

        // Save the updated lessonSegment using the repository
        const updatedLessonSegment = await this.lessonSegmentsRepository.save(lessonSegment);

        // Return the updated lessonSegment with lessonId explicitly included
        return {
            ...updatedLessonSegment,
            lessonId: updatedLessonSegment.lesson.id,
        } as LessonSegments;
    }

    async remove(lessonSegmentId: number): Promise<any> {
        const lessonSegment = await this.lessonSegmentsRepository.findOne({ where: { id: lessonSegmentId } });
        const oldLessonSegment = lessonSegment;
        if (!lessonSegment) {
            throw new NotFoundException('LessonSegment not found');
        }
    
        await this.lessonSegmentsRepository.delete(lessonSegmentId);
        return {
            message: "Course successfully deleted",
            deletedCourse: oldLessonSegment,
        }
    }

    findOneById(id: number): Promise<LessonSegments | undefined> {
        return this.lessonSegmentsRepository.findOne({
            where: { id }
        })
    }
}
