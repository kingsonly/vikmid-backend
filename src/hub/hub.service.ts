import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hub } from './entities/hub.entity';


@Injectable()
export class HubService {
    constructor(
        @InjectRepository(Hub)
        private hubsRepository: Repository<Hub>,
    ) { }

    // findOneByEmail(email: string): Promise<Hub | undefined> {
    //     return this.usersRepository.findOne({ where: { email } });
    // }

    async create(hub: Partial<Hub>) {

        return this.hubsRepository.save(hub);
    }

    async findAllByCreator(creatorId: number): Promise<Hub[]> {
        return this.hubsRepository.find(
            {
                where: { userId: creatorId, status: true }
            });
    }

    async findByUrl(url: string): Promise<Hub> {

        const hub = await this.hubsRepository.findOne({
            where: { hubUrl: url, status: true }
        });

        if (!hub) {
            throw new NotFoundException(`Hub with URL '${url}' not found.`);
        }

        return hub;
    }
}
