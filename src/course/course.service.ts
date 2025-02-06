import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity/course.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Lessons } from './lessons/lessons.entity/lessons.entity';
import { Enrollments } from './enrollments/enrollments.entity/enrollments.entity';

@Injectable()
export class CourseService {

    constructor(
        // this is hoe you get data from the database
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,

        @InjectRepository(Lessons)
        private readonly lessonRepository: Repository<Lessons>,

        @InjectRepository(Enrollments)
        private readonly enrollmentRepository: Repository<Enrollments>,

        // this is how you send data to the repo
        private readonly entityManager: EntityManager,

        // The user service
        private readonly userService: UsersService,
    ) {}

    async findAll() {
        const courses = await this.courseRepository.find({
            relations: ['creator', 'lessons', 'enrollments'],
        });

        if (courses.length === 0) {
            throw new NotFoundException("There are no courses for this user");
        }

        // Check if creator is being fetched correctly
        return courses.map(course => {
    
            return {
                ...course,
            };
        });
    }

    async findAllForUser() {
        const courses = await this.courseRepository.find({
            relations: ['creator', 'lessons', 'enrollments'],
        });

        if (courses.length === 0) {
            throw new NotFoundException("There are no courses for this user");
        }

        // Check if creator is being fetched correctly
        return courses.map(course => {
    
            return {
                ...course,
            };
        });
    }

    async findAllByUser(userId: number) {
        const courses = await this.courseRepository.find({
            where: {creator: {id: userId}},
            relations: ['creator', 'lessons', 'enrollments'],
        });

        if (courses.length === 0) {
            throw new NotFoundException("There are no courses for this user");
        }

        // Check if creator is being fetched correctly
        return courses.map(course => {
    
            return {
                ...course,
                creatorId: course.creator.id, // Accessing the creator ID directly
            };
        });
    }

    async create(courseDto: CreateCourseDto): Promise<Course> {
        // Fetch the user based on the provided creatorId
        const user = await this.userService.findOneById(courseDto.creatorId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        // Create the course entity and assign the creator relationship
        const course = this.courseRepository.create({ 
            ...courseDto, 
            creator: user 
        });
    
        // Save the course using the repository instead of the entityManager
        const savedCourse = await this.entityManager.save(course);
    
        // Return the saved course with the creatorId included
        return {
            ...savedCourse,
            creatorId: savedCourse.creator.id,
        } as Course;
    }

    async findOne(courseId: number, userId: number) {
        const course = await this.courseRepository.findOne({
            where: { id: courseId, creator: {id: userId} },
            relations: ['creator', 'lessons', 'enrollments'],  
        });
        if (!course) {
            throw new NotFoundException("Course not found for this user");
        }
        return {
            ...course,
            creatorId: course.creator.id,  
        };
    }

    async findAnyOne(courseId: number): Promise<Course> {
        const course = await this.courseRepository.findOne({
            where: { id: courseId },
            relations: ['creator', 'lessons', 'enrollments'],  
        });
        if (!course) {
            throw new NotFoundException("Course not found");
        }
        return course;
    }

    async update(courseId: number, courseDto: UpdateCourseDto): Promise<Course> {
        if (!courseDto || !courseDto.creatorId) {
            throw new ConflictException("Invalid or missing payload data")
        }

        // Find the existing course by ID
        const course = await this.courseRepository.findOne({ where: { id: courseId, creator: {id: courseDto.creatorId} }, relations: ['creator', 'lessons', 'enrollments'] });
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // If the creatorId is provided and needs to be updated
        if (courseDto.creatorId) {
            const user = await this.userService.findOneById(courseDto.creatorId);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            course.creator = user;
        }

        // Update only the provided fields
        Object.assign(course, courseDto);

        // Save the updated course using the repository
        const updatedCourse = await this.entityManager.save(course);

        // Return the updated course with creatorId explicitly included
        return {
            ...updatedCourse,
            creatorId: updatedCourse.creator.id,
        } as Course;
    }

    async remove(courseId: number): Promise<any> {
        const course = await this.courseRepository.findOne({ where: { id: courseId } });
        const oldCourse = course;
        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // Delete all related lesson segments
        if (course.lessons.length > 0) {
            await this.lessonRepository.remove(course.lessons);
        }
        
        // Delete all related lesson segments
        if (course.enrollments.length > 0) {
            await this.enrollmentRepository.remove(course.enrollments);
        }
    
        await this.courseRepository.delete(courseId);
        return {
            message: "Course successfully deleted",
            deletedCourse: oldCourse,
        }
    }

    
    findOneById(courseId: number): Promise<Course | undefined> {
        return this.courseRepository.findOne({
            where: { id: courseId }
        })
    }
}
