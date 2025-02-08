import { PartialType } from "@nestjs/mapped-types";
import { CreateLessonSegmentsDto } from "./create-lesson_segments.dto";

export class UpdateLessonSegmentsDto extends PartialType(CreateLessonSegmentsDto) {}