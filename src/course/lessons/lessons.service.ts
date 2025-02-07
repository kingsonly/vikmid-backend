import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    ) {}

    async findAll(courseId: string): Promise<any> {
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

    async findOne(courseId: string, lessonId: string): Promise<Lessons> {
        const lesson = await this.lessonRepository.findOne({
            where: {id: lessonId, course: {id: courseId}},
            relations: ['course', 'lessonSegments'],
        });

        if (!lesson) {
            throw new NotFoundException("Lesson not found in this course");
        }

        return lesson;
    }

    async findAnyOne(lessonId: string): Promise<Lessons> {
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

        // Check if a lesson with the same courseId and order already exists
        const existingLesson = await this.lessonRepository.findOne({
            where: { course: { id: lessonDto.courseId }, order: lessonDto.order }
        });

        if (existingLesson) {
            throw new NotFoundException('A lesson with this courseId and order already exists');
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

    async update(lessonId: string, lessonDto: UpdateLessonsDto): Promise<Lessons> {
        // Find the existing course by ID
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId }, relations: ['course', 'lessonSegments'] });
        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        // Check if the lessonDto has a payload
        if (!lessonDto || !lessonDto.courseId) {
            throw new BadRequestException('Invalid or missing payload data.');
        }
        
        const conflictingLesson = await this.lessonRepository.findOne({
            where: {
                course: { id: lessonDto.courseId },
                order: lessonDto.order,
                id: Not(lessonId)
            }
        });

        // Check if the updated order and courseId already exist for another lesson
        if (conflictingLesson) {
            throw new NotFoundException('Another lesson with this order already exists for this cours');
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

    async remove(lessonId: string): Promise<any> {
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
        const oldLesson = lesson;
        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        // Delete all related lesson segments
        if (lesson.lessonSegments.length > 0) {
            await this.lessonSegmentRepository.remove(lesson.lessonSegments);
        }
    
        await this.lessonRepository.delete(lessonId);
        return {
            message: "Course successfully deleted",
            deletedCourse: oldLesson,
        }
    }

    findOneById(id: string): Promise<Lessons | undefined> {
        return this.lessonRepository.findOne({
            where: { id }
        })
    }

    async updateOrders(updateLessonsDto: { lessonId: string; courseId: string; order: number }[]) {
        const updatedLessons: Lessons[] = [];
        
        for (const { lessonId, courseId, order } of updateLessonsDto) {
            // Fetch the existing lesson by ID and courseId
            const lesson = await this.lessonRepository.findOne({
                where: { id: lessonId, course: { id: courseId } },
                relations: ['course', 'lessonSegments'],
            });
    
            if (!lesson) {
                throw new NotFoundException(`Lesson with ID ${lessonId} not found in course ${courseId}`);
            }
    
            // Fetch the course to ensure it's valid
            const course = await this.courseService.findOneById(courseId);
            if (!course) {
                throw new NotFoundException(`Course with ID ${courseId} not found`);
            }
    
            // // Check if another lesson exists with the same order in this course (excluding current lesson)
            // const conflictingLesson = await this.lessonRepository.findOne({
            //     where: {
            //         course: { id: courseId },
            //         order: order,
            //         id: Not(lessonId),
            //     },
            // });
    
            // if (conflictingLesson) {
            //     throw new NotFoundException(`Another lesson with order ${order} already exists in this course`);
            // }
    
            // Update the lesson with the new order and course
            lesson.order = order;
            lesson.course = course;
    
            // Save the updated lesson
            const updatedLesson = await this.lessonRepository.save(lesson);
    
            // Push the updated lesson to the result array
            updatedLessons.push(updatedLesson);

        }
    
        // Return all the updated lessons
        return updatedLessons;
    }

}
