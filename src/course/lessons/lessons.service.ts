import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseService } from '../course.service';
import { EntityManager, Repository } from 'typeorm';
import { Lessons } from './lessons.entity/lessons.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLessonsDto } from './dto/create-lessons.dto';
import { UpdateLessonsDto } from './dto/update-lessons.dto';

@Injectable()
export class LessonsService {

    constructor(

        // The lesson repository for getting data from db4
        @InjectRepository(Lessons)
        private readonly lessonRepository: Repository<Lessons>,

        // The entity manager for sending data to db 
        private readonly entityManager: EntityManager,

        // The course service
        private readonly courseService: CourseService,
    ) {}

    async findAll(courseId: number): Promise<any> {
        const lessons = await this.lessonRepository.find({
            where: {course: {id: courseId}},
            relations: ['course', 'lessonSegments'],
        });

        if (lessons.length === 0) {
            throw new NotFoundException("There are no lessons for this course");
        }

        // Check if creator is being fetched correctly
        return lessons.map(lesson => {
    
            return {
                ...lesson,
                courseId: lesson.course.id, // Accessing the creator ID directly
            };
        });
    }

    async findOne(courseId: number, lessonId: number): Promise<Lessons> {
        const lesson = await this.lessonRepository.findOne({
            where: {id: lessonId, course: {id: courseId}},
            relations: ['course', 'lessonSegments'],
        });

        if (!lesson) {
            throw new NotFoundException("Lesson not found in this course");
        }

        return lesson;
    }

    async findAnyOne(lessonId: number): Promise<Lessons> {
        const lesson = await this.lessonRepository.findOne({
            where: {id: lessonId},
            relations: ['course', 'lessonSegments'],
        });

        if (!lesson) {
            throw new NotFoundException("Lesson not found");
        }

        return lesson;
    }

    async create(lessonDto: CreateLessonsDto): Promise<Lessons> {
        // Fetch the user based on the provided creatorId
        const course = await this.courseService.findOneById(lessonDto.courseId);
        if (!course) {
            throw new NotFoundException('Course not found');
        }
    
        // Create the course entity and assign the creator relationship
        const lesson = this.lessonRepository.create({ 
            ...lessonDto, 
            course: course
        });
    
        // Save the course using the repository instead of the entityManager
        const savedLesson = await this.lessonRepository.save(lesson);
    
        // Return the saved course with the creatorId included
        return {
            ...savedLesson,
            courseId: savedLesson.course.id
        } as Lessons;
    }

    async update(lessonId: number, lessonDto: UpdateLessonsDto): Promise<Lessons> {
        // Find the existing course by ID
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId }, relations: ['course', 'lessonSegments'] });
        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        // If the creatorId is provided and needs to be updated
        if (lessonDto.courseId) {
            const course = await this.courseService.findOneById(lessonDto.courseId);
            if (!course) {
                throw new NotFoundException('Course not found');
            }
            lesson.course = course;
        }

        // Update only the provided fields
        Object.assign(lesson, lessonDto);

        // Save the updated course using the repository
        const updatedLesson = await this.lessonRepository.save(lesson);

        // Return the updated course with creatorId explicitly included
        return {
            ...updatedLesson,
            courseId: updatedLesson.course.id,
        } as Lessons;
    }

    async remove(lessonId: number): Promise<any> {
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
        const oldLesson = lesson;
        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }
    
        await this.lessonRepository.delete(lessonId);
        return {
            message: "Course successfully deleted",
            deletedCourse: oldLesson,
        }
    }

    findOneById(id: number): Promise<Lessons | undefined> {
        return this.lessonRepository.findOne({
            where: { id }
        })
    }

}
