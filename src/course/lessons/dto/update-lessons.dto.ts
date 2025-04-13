import { PartialType } from "@nestjs/mapped-types";
import { CreateLessonsDto } from "./create-lessons.dto";

export class UpdateLessonsDto extends PartialType(CreateLessonsDto) {}