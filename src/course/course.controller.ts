import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CourseController {

    constructor(private readonly courseService: CourseService) {}


    @UseGuards(JwtAuthGuard)
    @Get('guest')
    async findAll() {
        return this.courseService.findAll(); // Pass the userId to the service
    }

    // Protect this route with the JwtAuthGuard
    @UseGuards(JwtAuthGuard)
    @Get('user')
    async findAllByUser(@Request() req) { // Using @Request to access the decoded token
        const userId = req.user.userId;  // Extract user ID from the token payload
        return this.courseService.findAllByUser(userId); // Pass the userId to the service
    }

    // Protect this route with the JwtAuthGuard
    @UseGuards(JwtAuthGuard)
    @Get(':courseId')
    async findOne(@Param('courseId', ParseIntPipe) courseId: number, @Request() req) {
        const userId = req.user.userId;
        return this.courseService.findOne(courseId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('course/:courseId')
    async findAnyOne(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.courseService.findAnyOne(courseId);
    }

    // Protect this route with the JwtAuthGuard
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body(ValidationPipe) course: CreateCourseDto) {
        return this.courseService.create(course);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':courseId')
    async update(@Param('courseId', ParseIntPipe) courseId: number, @Body(ValidationPipe) courseDto: UpdateCourseDto) {
        return this.courseService.update(courseId, courseDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':courseId')
    async remove(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.courseService.remove(courseId);
    }
}