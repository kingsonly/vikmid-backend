import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Enrollments } from './enrollments.entity/enrollments.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { CourseService } from '../course.service';
import { CreateEnrollmentsDto } from './dto/create-enrollments.dto';
import { UpdateEnrollmentsDto } from './dto/update-enrollments.dto';

@Injectable()
export class EnrollmentsService {

    constructor(
        // this is hoe you get data from the database
        @InjectRepository(Enrollments)
        private readonly enrollmentsRepository: Repository<Enrollments>,

        // this is how you send data to the repo
        private readonly entityManager: EntityManager,

        // The user service
        private readonly userService: UsersService,

        // The course service
        private readonly courseService: CourseService,
    ) {}

    async findAll() {
        const enrollments = await this.enrollmentsRepository.find({
            relations: ['student', 'course'],
        });

        if (enrollments.length === 0) {
            throw new HttpException("No enrollments found", HttpStatus.NO_CONTENT); // ✅ Returns 204 No Content
        }

        return enrollments;
    }

    async findAllByUser(userId: number) {
        const enrollments = await this.enrollmentsRepository.find({
            where: { student: { id: userId } },
            relations: ['student', 'course'],
        });

        if (enrollments.length === 0) {
            throw new HttpException("No enrollments found for this user", HttpStatus.NO_CONTENT); // ✅ Returns 204 No Content
        }

        return enrollments;
    }

    async findAllByCourse(courseId: string) {
        const enrollments = await this.enrollmentsRepository.find({
            where: {course: {id: courseId}},
            relations: ['student', 'course'],
        })   

        if (enrollments.length === 0) {
            throw new HttpException("No enrollments found for this course", HttpStatus.NO_CONTENT); // ✅ Returns 204 No Content
        }

        return enrollments;
    }

    async findOneByUser(enrollmentId: string, userId: number) {
        const enrollment = await this.enrollmentsRepository.findOne({
            where: { id: enrollmentId, student: {id: userId} },
            relations: ['student', 'course'],  
        });

        if (!enrollment) {
            throw new HttpException("Enrollment not found for this user", HttpStatus.NO_CONTENT);
        }

        return enrollment;
    } 

    async findOneByCourse(courseId: string, enrollmentId: string) {
        const enrollment = await this.enrollmentsRepository.findOne({
            where: { id: enrollmentId, course: {id: courseId} },
            relations: ['student', 'course'],  
        });

        if (!enrollment) {
            throw new HttpException("Enrollment not found for this Course", HttpStatus.NO_CONTENT);
        }

        return enrollment;
    }

    async create(enrollmentDto: CreateEnrollmentsDto): Promise<Enrollments> {
        // Check if the enrollment already exists for the given studentId and courseId
        const existingEnrollment = await this.enrollmentsRepository.findOne({
            where: {
                student: { id: enrollmentDto.studentId },
                course: { id: enrollmentDto.courseId },
            },
            relations: ['student', 'course'],
        });

        if (existingEnrollment) {
            throw new ConflictException('Enrollment already exists for this student and course');
        }


        // Fetch the user based on the provided studentId
        const user = await this.userService.findOneById(enrollmentDto.studentId);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NO_CONTENT);
        }

        const course = await this.courseService.findOneById(enrollmentDto.courseId);
        if (!course) {
            throw new HttpException('Course not found', HttpStatus.NO_CONTENT);
        }

        // Create the course entity and assign the creator relationship
        const enrollments = this.enrollmentsRepository.create({ 
            ...enrollmentDto, 
            student: user,
            course: course,
        });

        // Save the course using the repository instead of the entityManager
        const savedEnrollment = await this.entityManager.save(enrollments);

        // Return the saved course with the creatorId included
        return savedEnrollment;
    }

    async update(enrollmentId: string, enrollmentDto: UpdateEnrollmentsDto): Promise<Enrollments> {
        // Find the existing course by ID
        const enrollment = await this.enrollmentsRepository.findOne({ 
            where: { id: enrollmentId }, 
            relations: ['student', 'course'],
        });
        if (!enrollment) {
            throw new HttpException('Enrollment not found', HttpStatus.NO_CONTENT);
        }

        // Check for duplicate studentId and courseId during the update
        if (enrollmentDto.studentId && enrollmentDto.courseId) {
            const duplicateEnrollment = await this.enrollmentsRepository.findOne({
                where: {
                    student: { id: enrollmentDto.studentId },
                    course: { id: enrollmentDto.courseId },
                },
                relations: ['student', 'course'],
            });
            if (duplicateEnrollment && duplicateEnrollment.id !== enrollmentId) {
                throw new ConflictException('Another enrollment already exists for this student and course');
            }
        } else {
            throw new BadRequestException('Invalid or missing payload data.');
        }

        // If the creatorId is provided and needs to be updated
        if (enrollmentDto.studentId) {
            const user = await this.userService.findOneById(enrollmentDto.studentId);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NO_CONTENT);
            }
            enrollment.student = user;
        }

        // If the creatorId is provided and needs to be updated
        if (enrollmentDto.courseId) {
            const course = await this.courseService.findOneById(enrollmentDto.courseId);
            if (!course) {
                throw new HttpException('Course not found', HttpStatus.NO_CONTENT);
            }
            enrollment.course = course;
        }

        // Update only the provided fields
        Object.assign(enrollment, enrollmentDto);

        // Save the updated course using the repository
        const updatedEnrollment = await this.entityManager.save(enrollment);

        // Return the updated course with creatorId explicitly included
        return updatedEnrollment;
    }

    async remove(enrollmentId: string): Promise<any> {
        const enrollment = await this.enrollmentsRepository.findOne({ where: { id: enrollmentId } });
        const oldEnrollment = enrollment;
        if (!enrollment) {
            throw new HttpException('Enrollment not found', HttpStatus.NO_CONTENT);
        }

        await this.enrollmentsRepository.delete(enrollmentId);
        return {
            message: "Enrollment successfully deleted",
            deletedCourse: oldEnrollment,
        }
    }


    findOneById(enrollmentId: string): Promise<Enrollments | undefined> {
        return this.enrollmentsRepository.findOne({
            where: { id: enrollmentId }
        })
    }
}