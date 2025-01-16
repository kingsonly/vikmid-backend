import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonSegments } from './lesson_segments.entity/lesson_segments.entity';
import { LessonsService } from '../lessons.service';
import { EntityManager, Not, Repository } from 'typeorm';
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

        // Check if a lesson with the same courseId and order already exists
        const existingLessonSegment = await this.lessonSegmentsRepository.findOne({
            where: { lesson: { id: lessonSegmentDto.lessonId }, order: lessonSegmentDto.order }
        });

        if (existingLessonSegment) {
            throw new NotFoundException('A lessonSegment with this lessonId and order already exists');
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

        // Check if the lessonDto has a payload
        if (!lessonSegmentDto || !lessonSegmentDto.lessonId) {
            throw new BadRequestException('Invalid or missing payload data.');
        }
        
        const conflictingLessonSegment = await this.lessonSegmentsRepository.findOne({
            where: {
                lesson: { id: lessonSegmentDto.lessonId },
                order: lessonSegmentDto.order,
                id: Not(lessonSegmentId)
            }
        });

        // Check if the updated order and courseId already exist for another lesson
        if (conflictingLessonSegment) {
            throw new NotFoundException('Another lessonSegment with this order already exists for this lesson');
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
            deletedSegment: oldLessonSegment,
        }
    }

    async updateOrders(updateOrdersDto: { lessonSegmentId: number; lessonId: number; order: number }[]) {
        const updatedSegments: LessonSegments[] = [];

        for (const { lessonSegmentId, lessonId, order } of updateOrdersDto) {
            const lessonSegment = await this.lessonSegmentsRepository.findOne({
                where: { id: lessonSegmentId }
            });

            if (!lessonSegment) {
                throw new NotFoundException(`Lesson segment with ID ${lessonSegmentId} not found`);
            }

            // Validate if the lesson exists
            const lesson = await this.lessonsService.findOneById(lessonId);
            if (!lesson) {
                throw new NotFoundException(`Lesson with ID ${lessonId} not found`);
            }

            // // Check for conflicts with the same order and lessonId
            // const conflictingSegment = await this.lessonSegmentsRepository.findOne({
            //     where: {
            //         lesson: { id: lessonId },
            //         order: order,
            //         id: Not(lessonSegmentId)
            //     }
            // });

            // if (conflictingSegment) {
            //     throw new ConflictException(`Conflict: Another segment already has order ${order} for lesson ID ${lessonId}`);
            // }

            // Update order and lesson ID
            lessonSegment.order = order;
            lessonSegment.lesson = lesson;

            // Save the updated segment and push it to the results array
            const updatedSegment = await this.lessonSegmentsRepository.save(lessonSegment);
            updatedSegments.push(updatedSegment);
        }

        return updatedSegments;
    }

    findOneById(id: number): Promise<LessonSegments | undefined> {
        return this.lessonSegmentsRepository.findOne({
            where: { id }
        })
    }
}
