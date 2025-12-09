import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity/course.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Lessons } from './lessons/lessons.entity/lessons.entity';
import { Enrollments } from './enrollments/enrollments.entity/enrollments.entity';
import { paginate, PaginateQuery } from 'nestjs-paginate';

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
    ) { }

    // async findAll() {
    //     const courses = await this.courseRepository.find({
    //         relations: ['creator', 'lessons', 'enrollments'],
    //     });

    //     if (courses.length === 0) {
    //         throw new NotFoundException("There are no courses for this user");
    //     }

    //     // Check if creator is being fetched correctly
    //     return courses.map(course => {

    //         return {
    //             ...course,
    //         };
    //     });
    // }

    async findAllForUser(hubId: number, userId: number) {
        const courses = await this.courseRepository.find({
            where: { hubId: hubId, creator: { id: userId } },
            relations: ['creator', 'lessons', 'enrollments'],
        });

        if (courses.length === 0) {
            throw new HttpException("There are no courses for this user", HttpStatus.NO_CONTENT);
        }

        // Check if creator is being fetched correctly
        return courses;
    }

    async findAllHubCourse(query: PaginateQuery, hubId: number) {
        const courses = await paginate(query, this.courseRepository, {
            sortableColumns: ['id', 'createdAt'],
            defaultSortBy: [['createdAt', 'DESC']],
            where: { hubId: hubId, },
            relations: ['creator', 'lessons', 'lessons.lessonSegments']

        })
        // const courses = await this.courseRepository.find({
        //     where: { hubId: hubId, },
        //     relations: ['creator', 'lessons', 'lessons.lessonSegments'],
        // });

        // if (courses.length === 0) {
        //     throw new HttpException("There are no courses for this hub", HttpStatus.NO_CONTENT);
        // }

        return courses;
    }

    async findAllByUser(userId: number) {
        const courses = await this.courseRepository.find({
            where: { creator: { id: userId } },
            relations: ['creator', 'lessons', 'enrollments'],
        });

        if (courses.length === 0) {
            throw new HttpException("There are no courses for this user", HttpStatus.NO_CONTENT);
        }

        // Check if creator is being fetched correctly
        return courses;
    }

    async findOne(courseId: string, hubId: number) {
        const course = await this.courseRepository.findOne({
            where: { id: courseId, hubId },
            relations: ['creator', 'lessons', 'lessons.lessonSegments', 'enrollments'],
        });
        if (!course) {
            throw new HttpException("Course not found for this user", HttpStatus.NO_CONTENT);
        }

        return course;
    }

    async create(courseDto: CreateCourseDto): Promise<Course> {
        // Fetch the user based on the provided creatorId
        console.log("to see dto", courseDto)
        const user = await this.userService.findOneById(courseDto.creatorId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NO_CONTENT);
        }

        // Create the course entity and assign the creator relationship
        const course = this.courseRepository.create({
            ...courseDto,
            creator: user
        });

        // Save the course using the repository instead of the entityManager
        return await this.entityManager.save(course);



    }

    async findAnyOne(courseId: string): Promise<Course> {
        const course = await this.courseRepository.findOne({
            where: { id: courseId },
            relations: ['creator', 'lessons', 'enrollments'],
        });
        if (!course) {
            throw new HttpException("Course not found", HttpStatus.NO_CONTENT);
        }
        return course;
    }

    async update(courseId: string, courseDto: UpdateCourseDto): Promise<Course> {
        if (!courseDto) {
            throw new ConflictException("Invalid or missing payload data")
        }

        // Find the existing course by ID
        const course = await this.courseRepository.findOne({ where: { id: courseId, creator: { id: courseDto.creatorId } }, relations: ['creator', 'lessons', 'enrollments'] });
        if (!course) {
            throw new HttpException('Course not found', HttpStatus.NO_CONTENT);
        }

        // Update only the provided fields
        Object.assign(course, courseDto);

        // Save the updated course using the repository
        const updatedCourse = await this.entityManager.save(course);

        // Return the updated course with creatorId explicitly included
        return updatedCourse;
    }

    async remove(courseId: string, hubId: number): Promise<any> {
        const course = await this.courseRepository.findOne({ where: { id: courseId, hubId } });
        if (!course) {
            throw new HttpException('Course not found', HttpStatus.NO_CONTENT);
        }

        const oldCourse = course;

        // Delete all related lesson segments
        // if (course.lessons.length > 0) {
        //     await this.lessonRepository.remove(course.lessons);
        // }

        // // Delete all related lesson segments
        // if (course.enrollments.length > 0) {
        //     await this.enrollmentRepository.remove(course.enrollments);
        // }

        await this.courseRepository.delete(courseId);
        return {
            message: "Course successfully deleted",
            deletedCourse: oldCourse,
        }
    }


    findOneById(courseId: string): Promise<Course | undefined> {
        return this.courseRepository.findOne({
            where: { id: courseId }
        })
    }
}