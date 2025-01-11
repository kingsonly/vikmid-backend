import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLessonsDto } from './dto/create-lessons.dto';
import { UpdateLessonsDto } from './dto/update-lessons.dto';

@Controller('courses/lessons')
export class LessonsController {
    constructor(
        private readonly lessonsService: LessonsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get(':courseId')
    async findAll(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.lessonsService.findAll(courseId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':courseId/:lessonId')
    async findOne(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Param('lessonId', ParseIntPipe) lessonId: number
    ) {
        return this.lessonsService.findOne(courseId, lessonId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('lesson/:lessonId')
    async findAnyOne(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.lessonsService.findAnyOne(lessonId);
    }    

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body(ValidationPipe) lessonDto: CreateLessonsDto) {
        return this.lessonsService.create(lessonDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':lessonId')
    async update(@Param('lessonId', ParseIntPipe) lessonId: number, @Body(ValidationPipe) lessonDto: UpdateLessonsDto) {
        return this.lessonsService.update(lessonId, lessonDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':lessonId')
    async remove(@Param('lessonId', ParseIntPipe) lessonId: number) {
        return this.lessonsService.remove(lessonId);
    }
}
