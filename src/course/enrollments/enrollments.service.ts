import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
            throw new NotFoundException('No enrollments found');
        }

        return enrollments.map(enrollment => ({
            ...enrollment,
        }));
    }

    async findAllByUser(userId: number) {
        const enrollments = await this.enrollmentsRepository.find({
            where: { student: { id: userId } },
            relations: ['student', 'course'],
        });

        if (enrollments.length === 0) {
            throw new NotFoundException('No enrollments found for this user');
        }

        return enrollments.map(enrollment => ({
            ...enrollment,
            studentId: enrollment.student.id,
            courseId: enrollment.course.id,
        }));
    }

    async findAllByCourse(courseId: string) {
        const enrollments = await this.enrollmentsRepository.find({
            where: {course: {id: courseId}},
            relations: ['student', 'course'],
        })   

        if (enrollments.length === 0) {
            throw new NotFoundException("No enrollments for this course");
        }

        return enrollments.map(enrollment => ({
            ...enrollment,
            studentId: enrollment.student.id,
            courseId: enrollment.course.id,
        }))
    }

    async findOneByUser(enrollmentId: string, userId: number) {
        const enrollment = await this.enrollmentsRepository.findOne({
            where: { id: enrollmentId, student: {id: userId} },
            relations: ['student', 'course'],  
        });
        if (!enrollment) {
            throw new NotFoundException("Enrollment not found for this user");
        }
        return {
            ...enrollment,
            studentId: enrollment.student.id,
            courseId: enrollment.course.id,
        };
    }

    async findOneByCourse(courseId: string, enrollmentId: string) {
        const enrollment = await this.enrollmentsRepository.findOne({
            where: { id: enrollmentId, course: {id: courseId} },
            relations: ['student', 'course'],  
        });
        if (!enrollment) {
            throw new NotFoundException("Enrollment not found for this Course");
        }
        return {
            ...enrollment,
            studentId: enrollment.student.id,
            courseId: enrollment.course.id,
        };
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
            throw new NotFoundException('User not found');
        }

        const course = await this.courseService.findOneById(enrollmentDto.courseId);
        if (!course) {
            throw new NotFoundException('Course not found');
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
        return {
            ...savedEnrollment,
            studentId: savedEnrollment.student.id,
            courseId: savedEnrollment.course.id,
        } as Enrollments;
    }

    async update(enrollmentId: string, enrollmentDto: UpdateEnrollmentsDto): Promise<Enrollments> {
        // Find the existing course by ID
        const enrollment = await this.enrollmentsRepository.findOne({ 
            where: { id: enrollmentId }, 
            relations: ['student', 'course'],
        });
        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
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
                throw new NotFoundException('User not found');
            }
            enrollment.student = user;
        }

        // If the creatorId is provided and needs to be updated
        if (enrollmentDto.courseId) {
            const course = await this.courseService.findOneById(enrollmentDto.courseId);
            if (!course) {
                throw new NotFoundException('Course not found');
            }
            enrollment.course = course;
        }

        // Update only the provided fields
        Object.assign(enrollment, enrollmentDto);

        // Save the updated course using the repository
        const updatedEnrollment = await this.entityManager.save(enrollment);

        // Return the updated course with creatorId explicitly included
        return {
            ...updatedEnrollment,
            studentId: updatedEnrollment.student.id,
            courseId: updatedEnrollment.course.id,
        } as Enrollments;
    }

    async remove(enrollmentId: string): Promise<any> {
        const enrollment = await this.enrollmentsRepository.findOne({ where: { id: enrollmentId } });
        const oldEnrollment = enrollment;
        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
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