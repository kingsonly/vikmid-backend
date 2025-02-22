import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entity/page.entity';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/creat-page.dto';

@Injectable()
export class PagesService {
    constructor(
        @InjectRepository(Page) private readonly pageRepository: Repository<Page>,
    ) { }
    /**
     * Create a new page and save it to the database.
     * @returns The newly created page.
     */
    async createPage(data: CreatePageDto): Promise<Page> {
        const page = this.pageRepository.create(data);
        return await this.pageRepository.save(page);
    }
    async updatePage(data: Partial<CreatePageDto>, id: string): Promise<Page> {
        const page = await this.getPageById(id)
        if (!page) { throw new NotFoundException('Page not found'); }
        Object.assign(page, data);
        return await this.pageRepository.save(page);
    }
    async getPageById(id: string): Promise<Page> {
        const page = await this.pageRepository.findOne(
            { where: { id } },
        );
        if (!page) { throw new NotFoundException('Page not found'); }
        return page;
    }

    async deletePage(id: string): Promise<boolean> {
        const page = await this.getPageById(id)
        if (!page) { throw new NotFoundException('Page not found'); }
        let result = await this.pageRepository.delete(page.id);
        if (result.affected === 1) {
            return true;
        }
        return false

    }

    async getPageByProfileId(id: string): Promise<Page[]> {
        const page = await this.pageRepository.find(
            { where: { bioProfileId: id } },
        );
        if (!page) { throw new NotFoundException('Page not found'); }
        return page;
    }
}
