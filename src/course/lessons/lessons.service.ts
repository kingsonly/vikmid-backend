import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CourseService } from '../course.service';
import { EntityManager, Not, Repository } from 'typeorm';
import { Lessons } from './lessons.entity/lessons.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLessonsDto } from './dto/create-lessons.dto';
import { UpdateLessonsDto } from './dto/update-lessons.dto';
import { LessonSegments } from './lesson_segments/lesson_segments.entity/lesson_segments.entity';

@Injectable()
export class LessonsService {

    constructor(

        // The lesson repository for getting data from db4
        @InjectRepository(Lessons)
        private readonly lessonRepository: Repository<Lessons>,

        @InjectRepository(LessonSegments)
        private readonly lessonSegmentRepository: Repository<LessonSegments>,

        // The entity manager for sending data to db 
        private readonly entityManager: EntityManager,

        // The course service
        private readonly courseService: CourseService,
    ) { }

    async findAll(courseId: string): Promise<any> {
        const lessons = await this.lessonRepository.find({
            where: { course: { id: courseId } },
            relations: ['course', 'lessonSegments'],
        });

        if (lessons.length === 0) {
            throw new HttpException("There are no lessons for this course", HttpStatus.NO_CONTENT);
        }

        // Check if creator is being fetched correctly
        return lessons;
    }

    async findOne(courseId: string, lessonId: string): Promise<Lessons> {
        const lesson = await this.lessonRepository.findOne({
            where: { id: lessonId, course: { id: courseId } },
            relations: ['course', 'lessonSegments'],
        });

        if (!lesson) {
            throw new HttpException("Lesson not found in this course", HttpStatus.NO_CONTENT);
        }

        return lesson;
    }

    async findAnyOne(lessonId: string): Promise<Lessons> {
        const lesson = await this.lessonRepository.findOne({
            where: { id: lessonId },
            relations: ['course', 'lessonSegments'],
        });

        if (!lesson) {
            throw new HttpException("Lesson not found", HttpStatus.NO_CONTENT);
        }

        return lesson;
    }

    async create(lessonDto: CreateLessonsDto): Promise<Lessons> {
        // Fetch the course based on the provided courseId
        const course = await this.courseService.findOneById(lessonDto.courseId);
        if (!course) {
            throw new HttpException('Course not found', HttpStatus.NO_CONTENT);
        }

        const totalLessons = await this.lessonRepository.findOne({
            where: { course: { id: lessonDto.courseId } },
            order: { order: 'DESC' }, // Get the highest order
        });

        const newOrder = totalLessons ? totalLessons.order + 1 : 1;

        // Create the lesson entity and assign the course relationship
        const lesson = this.lessonRepository.create({
            ...lessonDto,
            course: course,
            order: newOrder // Set the calculated order dynamically
        });

        // Save the lesson using the repository
        const savedLesson = await this.lessonRepository.save(lesson);
        const cleanLesson = await this.lessonRepository.findOne({
            where: { id: savedLesson.id },
            relations: ['lessonSegments']
        });
        // Return the saved lesson
        return cleanLesson;
    }

    async update(lessonId: string, lessonDto: UpdateLessonsDto): Promise<Lessons> {
        // Find the existing course by ID
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId }, relations: ['course', 'lessonSegments'] });
        if (!lesson) {
            throw new HttpException('Lesson not found', HttpStatus.NO_CONTENT);
        }

        // Check if the lessonDto has a payload
        if (!lessonDto || !lessonDto.courseId) {
            throw new BadRequestException('Invalid or missing payload data.');
        }

        // Update only the provided fields
        Object.assign(lesson, lessonDto);

        // Save the updated course using the repository
        const updatedLesson = await this.lessonRepository.save(lesson);

        // Return the updated course with creatorId explicitly included
        return updatedLesson;
    }

    async remove(lessonId: string): Promise<any> {
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId }, relations: ["lessonSegments"] });
        const oldLesson = lesson;
        if (!lesson) {
            throw new HttpException('Lesson not found', HttpStatus.NO_CONTENT);
        }

        // Delete all related lesson segments
        //this should be done on the database level
        // if (lesson.lessonSegments.length > 0) {
        //     await this.lessonSegmentRepository.remove(lesson.lessonSegments);
        // }

        await this.lessonRepository.delete(lessonId);
        return oldLesson;
    }

    findOneById(id: string): Promise<Lessons | undefined> {
        return this.lessonRepository.findOne({
            where: { id }
        })
    }

    async updateOrders(updateLessonsDto: { lessonId: string; courseId: string }[]): Promise<Lessons[]> {
        let counter = 1;

        for (const { lessonId, courseId } of updateLessonsDto) {
            // Fetch the existing lesson by ID and courseId
            const lesson = await this.lessonRepository.findOne({
                where: { id: lessonId, course: { id: courseId } },
                relations: ['course', 'lessonSegments'],
            });

            if (!lesson) {
                throw new HttpException(`Lesson with ID ${lessonId} not found in course ${courseId}`, HttpStatus.NO_CONTENT);
            }

            // Fetch the course to ensure it's valid
            const course = await this.courseService.findOneById(courseId);
            if (!course) {
                throw new HttpException(`Course with ID ${courseId} not found`, HttpStatus.NO_CONTENT);
            }

            // Update the lesson order dynamically
            lesson.order = counter;
            lesson.course = course;

            await this.lessonRepository.save(lesson);
            counter++;
        }

        // Fetch and return all lessons after updating
        return this.lessonRepository.find({ relations: ['course', 'lessonSegments'] });
    }

}