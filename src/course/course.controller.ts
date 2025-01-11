import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CourseController {

    constructor(private readonly courseService: CourseService) {}

    // Protect this route with the JwtAuthGuard
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req) { // Using @Request to access the decoded token
        const userId = req.user.userId;  // Extract user ID from the token payload
        return this.courseService.findAll(userId); // Pass the userId to the service
    }

    // Protect this route with the JwtAuthGuard
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        const userId = req.user.userId;
        return this.courseService.findOne(id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('course/:id')
    async findAnyOne(@Param('id', ParseIntPipe) id: number) {
        return this.courseService.findAnyOne(id);
    }

    // Protect this route with the JwtAuthGuard
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body(ValidationPipe) course: CreateCourseDto) {
        return this.courseService.create(course);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body(ValidationPipe) courseDto: UpdateCourseDto) {
        return this.courseService.update(id, courseDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.courseService.remove(id);
    }
}