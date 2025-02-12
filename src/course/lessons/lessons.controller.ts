import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLessonsDto } from './dto/create-lessons.dto';
import { UpdateLessonsDto } from './dto/update-lessons.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Lessons } from './lessons.entity/lessons.entity';

@ApiTags('Lessons')
@Controller('courses/lessons')
export class LessonsController {
    constructor(
        private readonly lessonsService: LessonsService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get(':courseId')
    @ApiOperation({ summary: 'Retrieve all lessons for a course.' })
    @ApiParam({ name: 'courseId', required: true })
    @ApiResponse({ status: 200, description: 'Retrieve all lessons for a course.', type: [Lessons] })
    async findAll(@Param('courseId', ParseIntPipe) courseId: string) {
        return this.lessonsService.findAll(courseId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('lesson/:lessonId')
    @ApiOperation({ summary: 'Retrieve a single lesson.' })
    @ApiParam({ name: 'lessonId', required: true })
    @ApiResponse({ status: 200, description: 'Retrieve a single lesson.', type: Lessons})
    async findAnyOne(@Param('lessonId', ParseIntPipe) lessonId: string) {
        return this.lessonsService.findAnyOne(lessonId);
    }    

    @UseGuards(JwtAuthGuard)
    @Get(':courseId/:lessonId')
    @ApiOperation({ summary: 'Retrieve a specific lesson in a course.' })
    @ApiParam({ name: 'courseId', required: true })
    @ApiParam({ name: 'lessonId', required: true })
    @ApiResponse({ status: 200, description: 'Retrieve a specific lesson in a course.', type: Lessons })
    async findOne(
        @Param('courseId', ParseIntPipe) courseId: string,
        @Param('lessonId', ParseIntPipe) lessonId: string
    ) {
        return this.lessonsService.findOne(courseId, lessonId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiBody({ type: CreateLessonsDto })
    @ApiOperation({ summary: 'Create a new lesson.' })
    @ApiResponse({ status: 201, description: 'Lesson created successfully.', type: Lessons })
    async create(@Body(ValidationPipe) lessonDto: CreateLessonsDto) {
        return this.lessonsService.create(lessonDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update-orders')
    @ApiOperation({ summary: 'Update multiple lesson orders.' })
    @ApiBody({ description: 'Update lesson orders', type: [UpdateLessonsDto] })
    @ApiResponse({ status: 200, description: 'Lessons order updated successfully.', type: Lessons })
    async updateOrders(
        @Body() updateLessonsDto: { lessonId: string; courseId: string; order: number }[], 
    ) {
        return this.lessonsService.updateOrders(updateLessonsDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':lessonId')
    @ApiOperation({ summary: 'Update a lesson.' })
    @ApiParam({ name: 'lessonId', required: true })
    @ApiBody({ type: UpdateLessonsDto })
    @ApiResponse({ status: 200, description: 'Lesson updated successfully.', type: Lessons })
    async update(@Param('lessonId', ParseIntPipe) lessonId: string, @Body(ValidationPipe) lessonDto: UpdateLessonsDto) {
        return this.lessonsService.update(lessonId, lessonDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':lessonId')
    @ApiParam({ name: 'lessonId', required: true })
    @ApiOperation({ summary: 'Delete a lesson.' })
    @ApiResponse({ status: 200, description: 'Lesson deleted successfully.' })
    async remove(@Param('lessonId', ParseIntPipe) lessonId: string) {
        return this.lessonsService.remove(lessonId);
    }
}