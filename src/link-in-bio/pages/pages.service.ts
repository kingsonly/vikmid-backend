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
     * Creates a new page and saves it to the database.
     * @param {CreatePageDto} data - The data for creating the new page.
     * @returns {Promise<Page>} - The newly created page.
     */
    async createPage(data: CreatePageDto): Promise<Page> {
        const page = this.pageRepository.create(data);
        return await this.pageRepository.save(page);
    }

    /**
     * Updates an existing page by its ID.
     * @param {Partial<CreatePageDto>} data - The new data to update the page with.
     * @param {string} id - The ID of the page to update.
     * @returns {Promise<Page>} - The updated page.
     * @throws {NotFoundException} - If the page is not found.
     */
    async updatePage(data: Partial<CreatePageDto>, id: string): Promise<Page> {
        const page = await this.getPageById(id);
        if (!page) { throw new NotFoundException('Page not found'); }
        Object.assign(page, data);
        return await this.pageRepository.save(page);
    }

    /**
     * Retrieves a page by its ID.
     * @param {string} id - The ID of the page to retrieve.
     * @returns {Promise<Page>} - The found page.
     * @throws {NotFoundException} - If the page is not found.
     */
    async getPageById(id: string): Promise<Page> {
        const page = await this.pageRepository.findOne({ where: { id } });
        if (!page) { throw new NotFoundException('Page not found'); }
        return page;
    }

    /**
     * Deletes a page by its ID.
     * @param {string} id - The ID of the page to delete.
     * @returns {Promise<boolean>} - Returns `true` if the page was deleted successfully, otherwise `false`.
     * @throws {NotFoundException} - If the page is not found.
     */
    async deletePage(id: string): Promise<boolean> {
        const page = await this.getPageById(id);
        if (!page) { throw new NotFoundException('Page not found'); }
        let result = await this.pageRepository.delete(page.id);
        return result.affected === 1;
    }

    /**
     * Retrieves all pages associated with a specific bio profile.
     * @param {string} id - The ID of the bio profile.
     * @returns {Promise<Page[]>} - An array of pages belonging to the bio profile.
     * @throws {NotFoundException} - If no pages are found.
     */
    async getPageByProfileId(id: string): Promise<Page[]> {
        const page = await this.pageRepository.find({ where: { bioProfileId: id } });
        if (!page) { throw new NotFoundException('Page not found'); }
        return page;
    }
}
