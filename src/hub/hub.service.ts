import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hub } from './entities/hub.entity';
import { UpdateHubDto } from './dto/update-hub.dto';


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

    async getHubById(id: number): Promise<Hub> {

        const hub = await this.hubsRepository.findOne({
            where: { id: id, status: true }
        });

        if (!hub) {
            throw new NotFoundException(`Hub with URL '${id}' not found.`);
        }

        return hub;
    }
    async updateHub(id: number, hubDto: Partial<UpdateHubDto>): Promise<Hub> {

        const hub = await this.getHubById(id);
        if (!hub) { throw new NotFoundException('Page not found'); }
        Object.assign(hub, hubDto);
        return await this.hubsRepository.save(hub);
    }
}
