import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
        //get last page 
        const lastPage = await this.pageRepository.findOne({
            where: { bioProfileId: data.bioProfileId },
            order: { order: 'DESC' }, // Get the highest order
        });
        const newOrder = lastPage ? lastPage.order + 1 : 1;

        const createPage = this.pageRepository.create({
            ...data,
            order: newOrder,
        });
        const page = this.pageRepository.create(createPage);
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
        const page = await this.pageRepository.find({ where: { bioProfileId: id }, order: { order: 'ASC' }, });
        if (!page) { throw new NotFoundException('Page not found'); }
        return page;
    }

    /**
     * Reorders pages based on the provided array of page IDs.
     * @param {string[]} pageIds - An array of page IDs in the desired order.
     * @returns {Promise<boolean>} - Returns `true` if the reordering was successful.
     * @throws {BadRequestException} - If the provided array is empty.
     */
    async reorderPages(pageIds: string[]): Promise<boolean> {
        if (!pageIds || pageIds.length === 0) {
            throw new BadRequestException('Page IDs array cannot be empty');
        }

        await this.pageRepository.manager.transaction(async (transactionalEntityManager) => {
            for (let i = 0; i < pageIds.length; i++) {
                await transactionalEntityManager.update(
                    Page,
                    { id: pageIds[i] },
                    { order: i + 1 }
                );
            }
        });
        return true;
    }
}
