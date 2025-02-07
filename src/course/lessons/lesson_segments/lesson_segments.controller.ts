import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { LessonSegmentsService } from './lesson_segments.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateLessonSegmentsDto } from './dto/create-lesson_segments.dto';
import { UpdateLessonSegmentsDto } from './dto/update-lesson_segments.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LessonSegments } from './lesson_segments.entity/lesson_segments.entity';

@ApiTags('Lesson Segments')
@Controller('courses/lesson/lesson-segments')
export class LessonSegmentsController {
    constructor(
        private readonly lessonSegmentsService: LessonSegmentsService,
    ) {}

    @Get(':lessonId')
    @ApiParam({ name: 'lessonId', type: String, description: 'ID of the lesson' })
    @ApiOperation({ summary: 'Fetch all lessons segments for a particular lesson' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved lesson segments.', type: [LessonSegments] })
    async findAll(@Param('lessonId', ParseIntPipe) lessonId: string) {
        return this.lessonSegmentsService.findAll(lessonId);
    }

    @Get('lessonSegment/:lessonSegmentId')
    @ApiParam({ name: 'lessonSegmentId', type: String, description: 'ID of the lesson segment' })
    @ApiOperation({ summary: 'Fetch a specific lesson segment by its ID' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved the lesson segment.', type: LessonSegments })
    async findAnyOne(@Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: string) {
        return this.lessonSegmentsService.findAnyOne(lessonSegmentId);
    }  

    @Get(':lessonId/:lessonSegmentId')
    @ApiParam({ name: 'lessonId', type: String, description: 'ID of the lesson' })
    @ApiParam({ name: 'lessonSegmentId', type: String, description: 'ID of the lesson segment' })
    @ApiOperation({ summary: 'Fetch a specific lesson segment by lesson and segment IDs' })
    @ApiResponse({ status: 200, description: 'Successfully retrieved the lesson segment.', type: LessonSegments })
    async findOne(
        @Param('lessonId', ParseIntPipe) lessonId: string,
        @Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: string
    ) {
        return this.lessonSegmentsService.findOne(lessonId, lessonSegmentId);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new lesson segment' })
    @ApiResponse({ status: 201, description: 'Lesson segment successfully created.', type: LessonSegments })
    async create(@Body() lessonSegmentDto: CreateLessonSegmentsDto) {
        return this.lessonSegmentsService.create(lessonSegmentDto);
    }

    @Patch('update-orders')
    @ApiOperation({ summary: 'Update orders for multiple lesson segments' })
    @ApiResponse({ status: 200, description: 'Lesson segment orders successfully updated.', type: [LessonSegments] })
    async updateOrders(
        @Body(new ValidationPipe({ whitelist: true })) 
        updateOrdersDto: { lessonSegmentId: string; lessonId: string; order: number }[]
    ) {
        return this.lessonSegmentsService.updateOrders(updateOrdersDto);
    }

    @Patch(':lessonSegmentId')
    @ApiParam({ name: 'lessonSegmentId', type: String, description: 'ID of the lesson segment' })
    @ApiOperation({ summary: 'Update a specific lesson segment by its ID' })
    @ApiResponse({ status: 200, description: 'Lesson segment successfully updated.', type: LessonSegments })
    async update(
        @Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: string, 
        @Body() lessonSegmentDto: UpdateLessonSegmentsDto
    ) {
        return this.lessonSegmentsService.update(lessonSegmentId, lessonSegmentDto);
    }

    @Delete(':lessonSegmentId')
    @ApiParam({ name: 'lessonSegmentId', type: String, description: 'ID of the lesson segment' })
    @ApiOperation({ summary: 'Delete a lesson segment by its ID' })
    @ApiResponse({ status: 200, description: 'Lesson segment successfully deleted.', type: () => [{
        message: String,
        deletedSegment: Object,
    }]})
    async remove(@Param('lessonSegmentId', ParseIntPipe) lessonSegmentId: string) {
        return this.lessonSegmentsService.remove(lessonSegmentId);
    }
}
