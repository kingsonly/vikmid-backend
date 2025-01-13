import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { LessonSegmentsService } from './lesson_segments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLessonSegmentsDto } from './dto/create-lesson_segments.dto';
import { UpdateLessonSegmentsDto } from './dto/update-lesson_segments.dto';

@Controller('courses/lesson/lesson-segments')
export class LessonSegmentsController {
    constructor(
        private readonly lessonSegmentsService: LessonSegmentsService,
    ) {}

    // Get all lesson segments by lesson ID
    @Get(':lessonId')
    async findAll(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.lessonSegmentsService.findAll(lessonId);
    }

     // Get a lesson segment by segment ID only
     @Get('lessonSegment/:lessonSegmentId')
     async findAnyOne(@Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: number) {
         return this.lessonSegmentsService.findAnyOne(lessonSegmentId);
     }  
 

    // Get a specific lesson segment by lesson and segment ID
    @Get(':lessonId/:lessonSegmentId')
    async findOne(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: number
    ) {
        return this.lessonSegmentsService.findOne(lessonId, lessonSegmentId);
    }

    // Create a new lesson segment
    @Post()
    async create(@Body() lessonSegmentDto: CreateLessonSegmentsDto) {
        return this.lessonSegmentsService.create(lessonSegmentDto);
    }

    // Update an existing lesson segment by segment ID
    @Patch(':lessonSegmentId')
    async update(
        @Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: number, 
        @Body() lessonSegmentDto: UpdateLessonSegmentsDto
    ) {
        return this.lessonSegmentsService.update(lessonSegmentId, lessonSegmentDto);
    }

    // Delete a lesson segment by segment ID
    @Delete(':lessonSegmentId')
    async remove(@Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: number) {
        return this.lessonSegmentsService.remove(lessonSegmentId);
    }
}
