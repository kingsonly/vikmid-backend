import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentsDto } from './dto/create-enrollments.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateEnrollmentsDto } from './dto/update-enrollments.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
// import { Enrollments } from './enrollments.entity/enrollments.entity';
import { Enrollments } from './enrollments.entity/enrollments.entity';

@ApiTags('Enrollments')
@Controller('courses/enrollments')
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) {}


    /** Fetch all enrollments for the authenticated user */
    @UseGuards(JwtAuthGuard)
    @Get('user')
    @ApiOperation({ summary: 'Fetch all enrollments for the authenticated user' })
    @ApiResponse({
        status: 200,
        description: 'List of enrollments for the authenticated user',
        type: [() => Enrollments], // Replace with appropriate DTO or response model
    })
    async findAllByUser(@Request() req) {
        return this.enrollmentsService.findAllByUser(req.user.userId);
    }

    /** Fetch all enrollments for a specific course */
    @UseGuards(JwtAuthGuard)
    @Get('course/:courseId')
    @ApiOperation({ summary: 'Fetch all enrollments for a specific course' })
    @ApiParam({
        name: 'courseId',
        description: 'The ID of the course for which to fetch enrollments',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'List of enrollments for the course',
        type: [() => Enrollments], // Replace with appropriate DTO or response model
    })
    async findAllByCourse(@Param('courseId', ParseIntPipe) courseId: string) {
        return this.enrollmentsService.findAllByCourse(courseId);
    }

    /** Fetch a specific enrollment for the authenticated user */
    @UseGuards(JwtAuthGuard)
    @Get('user/:enrollmentId')
    @ApiOperation({ summary: 'Fetch a specific enrollment for the authenticated user' })
    @ApiParam({
        name: 'enrollmentId',
        description: 'The ID of the enrollment to fetch for the authenticated user',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'The enrollment data for the user',
        type: () => Enrollments, // Replace with appropriate DTO or response model
    })
    async findOneByUser(
        @Param('enrollmentId', ParseIntPipe) enrollmentId: string,
        @Request() req
    ) {
        return this.enrollmentsService.findOneByUser(enrollmentId, req.user.userId);
    }

    /** Fetch a specific enrollment for a course */
    @UseGuards(JwtAuthGuard)
    @Get('course/:courseId/enrollment/:enrollmentId')
    @ApiOperation({ summary: 'Fetch a specific enrollment for a course' })
    @ApiParam({
        name: 'courseId',
        description: 'The ID of the course to fetch the enrollment for',
        type: String,
    })
    @ApiParam({
        name: 'enrollmentId',
        description: 'The ID of the enrollment to fetch for the course',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'The enrollment data for the course',
        type: () => Enrollments, // Replace with appropriate DTO or response model
    })
    async findOneByCourse(
        @Param('courseId', ParseIntPipe) courseId: string,
        @Param('enrollmentId', ParseIntPipe) enrollmentId: string
    ) {
        return this.enrollmentsService.findOneByCourse(courseId, enrollmentId);
    }

    /** Create a new enrollment */
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new enrollment' })
    @ApiResponse({
        status: 201,
        description: 'The newly created enrollment',
        type: () => Enrollments, // Replace with appropriate DTO or response model
    })
    async create(@Body(ValidationPipe) enrollmentDto: CreateEnrollmentsDto) {
        return this.enrollmentsService.create(enrollmentDto);
    }

    /** Update an enrollment */
    @UseGuards(JwtAuthGuard)
    @Patch(':enrollmentId')
    @ApiOperation({ summary: 'Update an enrollment' })
    @ApiParam({
        name: 'enrollmentId',
        description: 'The ID of the enrollment to update',
        type: String,
    })
    @ApiResponse({ status: 200, description: 'The updated enrollment', type: () => Enrollments})
    async update(
        @Param('enrollmentId', ParseIntPipe) enrollmentId: string,
        @Body(ValidationPipe) enrollmentDto: UpdateEnrollmentsDto
    ) {
        return this.enrollmentsService.update(enrollmentId, enrollmentDto);
    }

    /** Delete an enrollment */
    @UseGuards(JwtAuthGuard)
    @Delete(':enrollmentId')
    @ApiOperation({ summary: 'Delete an enrollment' })
    @ApiParam({
        name: 'enrollmentId',
        description: 'The ID of the enrollment to delete',
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: 'Enrollment successfully deleted',
    })
    async remove(@Param('enrollmentId', ParseIntPipe) enrollmentId: string) {
        return this.enrollmentsService.remove(enrollmentId);
    }
}