import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Course } from './course.entity/course.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'config/storage.provider';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { ParseFormDataBooleanPipe } from './helper/pipe/ParseFormDataBooleanPipe';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {

    constructor(
        private readonly courseService: CourseService,
        private readonly storageService: StorageService) { }



    // @Get('all/guest')
    // @ApiOperation({ summary: 'Get all courses for guests' })
    // @ApiResponse({ status: 200, description: 'List of all courses', type: [Course] })
    // async findAll() {
    //     const courses = await this.courseService.findAll();
    //     return { data: courses, message: 'Courses fetched successfully' };
    // }

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'file', maxCount: 1 },
        ]
    ))
    @ApiOperation({ summary: 'Create a new course' })
    @ApiResponse({ status: 201, description: 'Course created successfully', type: Course })
    @UsePipes(new ParseFormDataBooleanPipe(), new ValidationPipe({ transform: true }))
    async create(
        @UploadedFiles() files: { file: Express.Multer.File[] },
        @Body() course: CreateCourseDto
    ) {
        if (!files?.file?.[0]) {
            throw new BadRequestException('File must be uploaded');
        }
        let storage = await this.storageService.uploadFile(files.file[0], 'course-banner-video');
        if (storage) {
            course.file = storage.url;
        }
        const newCourse = await this.courseService.create(course);
        return { data: newCourse, message: 'Course created successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    @ApiOperation({ summary: 'Get all courses created by a specific user' })
    @ApiResponse({ status: 200, description: 'List of courses created by the user', type: [Course] })
    async findAllByUser(@Param('userId', ParseIntPipe) userId: number) {
        const courses = await this.courseService.findAllByUser(userId);
        return { data: courses, message: 'User courses fetched successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('all/user/:hubId')
    @ApiOperation({ summary: 'Get all courses for authenticated users' })
    @ApiParam({ name: 'hubId', description: 'ID of the hub' })
    @ApiResponse({ status: 200, description: 'List of all courses for an authenticated user under a hub', type: [Course] })
    async findAllForUser(@Param('hubId') hubId: number, @Request() req) {
        const userId = req.user.userId;
        const courses = await this.courseService.findAllForUser(hubId, userId);
        return { data: courses, message: 'Courses for user under this hub fetched successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Get('all-hub-courses/:hubId')
    @ApiOperation({ summary: 'Get all courses for Active hub' })
    @ApiParam({ name: 'hubId', description: 'ID of the hub' })
    @ApiResponse({ status: 200, description: 'List of all courses for an authenticated user under a hub', type: [Course] })
    async findAllForHub(@Paginate() query: PaginateQuery, @Param('hubId') hubId: number, @Request() req) {

        const courses = await this.courseService.findAllHubCourse(query, hubId);
        return courses;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':courseId/:hubId')
    @ApiOperation({ summary: 'Get a course by ID for a specific user' })
    @ApiParam({ name: 'courseId', description: 'ID of the course' })
    @ApiParam({ name: 'hubId', description: 'ID of the hub' })
    @ApiResponse({ status: 200, description: 'Course details', type: Course })
    async findOne(@Param('courseId') courseId: string, @Param('hubId') hubId: number) {
        const course = await this.courseService.findOne(courseId, hubId);
        return { data: course, message: 'Course details fetched successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/update/:courseId')
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'file', maxCount: 1 },
        ]
    ))
    @ApiOperation({ summary: 'Update a course' })
    @ApiParam({ name: 'courseId', description: 'ID of the course' })
    @ApiResponse({ status: 200, description: 'Course updated successfully', type: Course })
    async update(
        @UploadedFiles() files: { file: Express.Multer.File[] },
        @Param('courseId') courseId: string,
        @Body(
            new ParseFormDataBooleanPipe(),
            new ValidationPipe({ transform: true, whitelist: true })
        ) courseDto: UpdateCourseDto
    ) {
        const course = await this.courseService.findAnyOne(courseId);
        if (files?.file) {
            let storage = await this.storageService.uploadFile(files.file[0], 'course-banner-video');
            if (storage) {
                courseDto.file = storage.url;
                // //delete previous file
                // if (course.file.length > 0) {
                //     await this.storageService.deleteFile(course.file);
                // }

            }
        }
        return await this.courseService.update(courseId, courseDto);

    }

    @UseGuards(JwtAuthGuard)
    @Delete(':courseId/:hubId')
    @ApiOperation({ summary: 'Delete a course' })
    @ApiParam({ name: 'courseId', description: 'ID of the course' })
    @ApiParam({ name: 'hubId', description: 'ID of the hub' })
    @ApiResponse({ status: 200, description: 'Course deleted successfully' })
    async remove(@Param('courseId') courseId: string, @Param('hubId') hubId: number) {
        return await this.courseService.remove(courseId, hubId);
    }
}