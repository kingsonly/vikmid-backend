import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentsDto } from './dto/create-enrollments.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateEnrollmentsDto } from './dto/update-enrollments.dto';

@Controller('courses/enrollments')
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) {}

    /** Fetch all enrollments */
    @UseGuards(JwtAuthGuard)
    @Get('guest')
    async findAll() {
        return this.enrollmentsService.findAll();
    }

    /** Fetch all enrollments for the authenticated user */
    @UseGuards(JwtAuthGuard)
    @Get('user')
    async findAllByUser(@Request() req) {
        return this.enrollmentsService.findAllByUser(req.user.userId);
    }

    /** Fetch all enrollments for a specific course */
    @UseGuards(JwtAuthGuard)
    @Get('course/:courseId')
    async findAllByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
        return this.enrollmentsService.findAllByCourse(courseId);
    }

    /** Fetch a specific enrollment for the authenticated user */
    @UseGuards(JwtAuthGuard)
    @Get('user/:enrollmentId')
    async findOneByUser(
        @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
        @Request() req
    ) {
        return this.enrollmentsService.findOneByUser(enrollmentId, req.user.userId);
    }

    /** Fetch a specific enrollment for a course */
    @UseGuards(JwtAuthGuard)
    @Get('course/:courseId/enrollment/:enrollmentId')
    async findOneByCourse(
        @Param('courseId', ParseIntPipe) courseId: number,
        @Param('enrollmentId', ParseIntPipe) enrollmentId: number
    ) {
        return this.enrollmentsService.findOneByCourse(courseId, enrollmentId);
    }

    /** Create a new enrollment */
    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body(ValidationPipe) enrollmentDto: CreateEnrollmentsDto) {
        return this.enrollmentsService.create(enrollmentDto);
    }

    /** Update an enrollment */
    @UseGuards(JwtAuthGuard)
    @Patch(':enrollmentId')
    async update(
        @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
        @Body(ValidationPipe) enrollmentDto: UpdateEnrollmentsDto
    ) {
        return this.enrollmentsService.update(enrollmentId, enrollmentDto);
    }

    /** Delete an enrollment */
    @UseGuards(JwtAuthGuard)
    @Delete(':enrollmentId')
    async remove(@Param('enrollmentId', ParseIntPipe) enrollmentId: number) {
        return this.enrollmentsService.remove(enrollmentId);
    }

}
