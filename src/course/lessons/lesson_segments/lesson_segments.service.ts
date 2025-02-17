import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

    async findAll(lessonId: string): Promise<any> {
        const lessonSegments = await this.lessonSegmentsRepository.find({
            where: {lesson: {id: lessonId}},
            relations: ['lesson'],
        });

        if (lessonSegments.length === 0) {
            throw new HttpException("There are no segments for this lesson", HttpStatus.NO_CONTENT);
        }

        return lessonSegments;
    }

    async findOne(lesonId: string, lessonSegmentId: string): Promise<LessonSegments> {
        const lessonSegment = await this.lessonSegmentsRepository.findOne({
            where: {id: lessonSegmentId, lesson: {id: lesonId}},
            relations: ['lesson'],
        });

        if (!lessonSegment) {
            throw new HttpException("Lesson segment not found in this lesson", HttpStatus.NO_CONTENT);
        }

        return lessonSegment;
    }

    async findAnyOne(lessonSegmentId: string): Promise<LessonSegments> {
        const lessonSegment = await this.lessonSegmentsRepository.findOne({
            where: {id: lessonSegmentId},
            relations: ['lesson'],
        });

        if (!lessonSegment) {
            throw new HttpException("LessonSegment not found", HttpStatus.NO_CONTENT);
        }

        return lessonSegment;
    }

    async create(lessonSegmentDto: CreateLessonSegmentsDto): Promise<LessonSegments> {
        // Fetch the lesson based on the provided lessonId
        const lesson = await this.lessonsService.findOneById(lessonSegmentDto.lessonId);
        if (!lesson) {
            throw new HttpException('Lesson not found', HttpStatus.NO_CONTENT);
        }
    
        // Count the number of existing lesson segments for this lesson
        const totalSegments = await this.lessonSegmentsRepository.count({
            where: { lesson: { id: lessonSegmentDto.lessonId } }
        });
    
        // Assign the new order dynamically (last position)
        const newOrder = totalSegments + 1;
    
        // Create the lessonSegment entity and assign the lesson relationship
        const lessonSegment = this.lessonSegmentsRepository.create({ 
            ...lessonSegmentDto, 
            lesson: lesson,
            order: newOrder // Set the calculated order dynamically
        });
    
        // Save the lesson using the repository instead of the entityManager
        const savedLessonSegment = await this.lessonSegmentsRepository.save(lessonSegment);
    
        // Return the saved lesson with the lessonId included
        return savedLessonSegment;
    }

    async update(lessonSegmentId: string, lessonSegmentDto: UpdateLessonSegmentsDto): Promise<LessonSegments> {
        // Find the existing lessonSegment by ID
        const lessonSegment = await this.lessonSegmentsRepository.findOne({ where: { id: lessonSegmentId }, relations: ['lesson'] });
        if (!lessonSegment) {
            throw new HttpException('Lesson segment not found', HttpStatus.NO_CONTENT);
        }

        // Check if the lessonDto has a payload
        if (!lessonSegmentDto || !lessonSegmentDto.lessonId) {
            throw new BadRequestException('Invalid or missing payload data.');
        }

        // Update only the provided fields
        Object.assign(lessonSegment, lessonSegmentDto);

        // Save the updated lessonSegment using the repository
        const updatedLessonSegment = await this.lessonSegmentsRepository.save(lessonSegment);

        // Return the updated lessonSegment with lessonId explicitly included
        return updatedLessonSegment;
    }

    async remove(lessonSegmentId: string): Promise<any> {
        const lessonSegment = await this.lessonSegmentsRepository.findOne({ where: { id: lessonSegmentId } });
        const oldLessonSegment = lessonSegment;
        if (!lessonSegment) {
            throw new HttpException('LessonSegment not found', HttpStatus.NO_CONTENT);
        }

        await this.lessonSegmentsRepository.delete(lessonSegmentId);
        return oldLessonSegment;
    }

    async updateOrders(updateOrdersDto: { lessonSegmentId: string; lessonId: string }[]): Promise<LessonSegments[]> {
        let counter = 1;
    
        for (const { lessonSegmentId, lessonId } of updateOrdersDto) {
            const lessonSegment = await this.lessonSegmentsRepository.findOne({
                where: { id: lessonSegmentId }
            });
    
            if (!lessonSegment) {
                throw new HttpException(`Lesson segment with ID ${lessonSegmentId} not found`, HttpStatus.NO_CONTENT);
            }
    
            // Validate if the lesson exists
            const lesson = await this.lessonsService.findOneById(lessonId);
            if (!lesson) {
                throw new HttpException(`Lesson with ID ${lessonId} not found`, HttpStatus.NO_CONTENT);
            }
    
            lessonSegment.order = counter;
            lessonSegment.lesson = lesson;
    
            await this.lessonSegmentsRepository.save(lessonSegment);
            counter++;
        }
    
        // Fetch and return all lesson segments after updating
        return this.lessonSegmentsRepository.find();
    }
    

    findOneById(id: string): Promise<LessonSegments | undefined> {
        return this.lessonSegmentsRepository.findOne({
            where: { id }
        })
    }
}