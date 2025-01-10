import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity/course.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {

    constructor(
        // this is hoe you get data from the database
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,

        // this is how you send data to the repo
        private readonly entityManager: EntityManager,

        // The user service
        private readonly userService: UsersService,
    ) {}

    async findAll(userId: number) {
        const courses = await this.courseRepository.find({
            where: {creator: {id: userId}},
            relations: ['creator'],
        });
    
        const data = courses;
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

    async findOne(id: number) {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: ['creator'],  // ✅ Make sure to load the relation here too
        });
        if (!course) {
            throw new NotFoundException("Course Not Found");
        }
        return {
            ...course,
            creatorId: course.creator.id,  // ✅ Extracting only the ID
        };
    }

    async update(courseId: number, courseDto: UpdateCourseDto): Promise<Course> {
         // Find the existing course by ID
        const course = await this.courseRepository.findOne({ where: { id: courseId }, relations: ['creator'] });
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

    async remove(id: number): Promise<any> {
        const course = await this.courseRepository.findOne({ where: { id } });
        const oldCourse = course;
        if (!course) {
            throw new NotFoundException('Course not found');
        }
    
        await this.courseRepository.delete(id);
        return {
            message: "Course successfully deleted",
            deletedCourse: oldCourse,
        }
    }
}
