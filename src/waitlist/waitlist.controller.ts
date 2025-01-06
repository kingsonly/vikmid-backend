import { Body, Post, Controller } from '@nestjs/common';
import { WaitlistDto } from './dto/waitlist.dto';
import { WaitlistService } from './waitlist.service';

@Controller('waitlist')
export class WaitlistController {
    constructor(private readonly waitlistService: WaitlistService) { }

    @Post('create')
    async create(@Body() waitlistDto: WaitlistDto) {
        return this.waitlistService.create(waitlistDto);
    }

}
