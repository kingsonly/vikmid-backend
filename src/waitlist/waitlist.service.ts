import { Injectable } from '@nestjs/common';
import { Waitlist } from './waitlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class WaitlistService {
    constructor(
        @InjectRepository(Waitlist)
        private waitlistRepository: Repository<Waitlist>,
    ) { }

    create(data: Partial<Waitlist>): Promise<Waitlist | undefined> {
        return this.waitlistRepository.save(data);
    }
}
