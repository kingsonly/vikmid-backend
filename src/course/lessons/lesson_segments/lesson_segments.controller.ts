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

    @UseGuards(JwtAuthGuard)
    @Get(':lessonId')
    async findAll(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.lessonSegmentsService.findAll(lessonId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':lessonId/:lessonSegmentId')
    async findOne(
        @Param('lessonId', ParseIntPipe) lessonId: number,
        @Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: number
    ) {
        return this.lessonSegmentsService.findOne(lessonId, lessonSegmentId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('lessonSegment/:lessonSegmentId')
    async findAnyOne(@Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: number) {
        return this.lessonSegmentsService.findAnyOne(lessonSegmentId);
    }  

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body(ValidationPipe) lessonSegmentDto: CreateLessonSegmentsDto) {
        return this.lessonSegmentsService.create(lessonSegmentDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':lessonSegmentId')
    async update(@Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: number, @Body(ValidationPipe) lessonSegmentDto: UpdateLessonSegmentsDto) {
        return this.lessonSegmentsService.update(lessonSegmentId, lessonSegmentDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':lessonSegmentId')
    async remove(@Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: number) {
        return this.lessonSegmentsService.remove(lessonSegmentId);
    }
}
