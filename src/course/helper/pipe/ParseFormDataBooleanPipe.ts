// import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

// @Injectable()
// export class ParseFormDataBooleanPipe implements PipeTransform {
//     transform(value: any, metadata: ArgumentMetadata) {
//         const booleanFields = [
//             'withBatch',
//             'status',
//             'withTrailer',
//             'withDiscount',
//             'withCertificate'
//         ];

//         for (const key of booleanFields) {
//             if (key in value) {
//                 value[key] = value[key] === 'true' || value[key] === true;
//             }
//         }

//         return value;
//     }
// }


import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EnrollmentQuestionDto } from 'src/course/dto/create-course.dto';

@Injectable()
export class ParseFormDataBooleanPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const booleanFields = [
            'withBatch',
            'status',
            'withTrailer',
            'withDiscount',
            'withCertificate',
        ];

        for (const key of booleanFields) {
            if (key in value) {
                value[key] = value[key] === 'true' || value[key] === true;
            }
        }

        // Parse and transform enrollmentQuestions
        if (value.enrollmentQuestions && typeof value.enrollmentQuestions === 'string') {
            try {
                const parsed = JSON.parse(value.enrollmentQuestions);
                if (!Array.isArray(parsed)) throw new Error();

                // 🔥 Transform into EnrollmentQuestionDto instances
                value.enrollmentQuestions = plainToInstance(EnrollmentQuestionDto, parsed);
            } catch {
                throw new BadRequestException('Invalid JSON format for enrollmentQuestions');
            }
        }

        return value;
    }
}
