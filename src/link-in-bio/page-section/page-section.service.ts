import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PageSectionDto } from './dto/page-section.dto';
import { PageSection } from '../entity/page_section.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PageSectionService {
    constructor(
        @InjectRepository(PageSection)
        private pageSectionRepository: Repository<PageSection>,
    ) { }

    /**
     * Creates a new page section and assigns it the next available order value.
     * @param {PageSectionDto} pageSectionDto - The DTO containing page section details.
     * @returns {Promise<PageSection>} The newly created page section.
     */
    async createPageSection(pageSectionDto: PageSectionDto): Promise<PageSection> {
        // Find the highest order value for the given page
        const lastSection = await this.pageSectionRepository.findOne({
            where: { pageId: pageSectionDto.pageId },
            order: { order: 'DESC' }, // Get the highest order
        });

        // Set order as last order + 1, or default to 1 if no previous sections exist
        const newOrder = lastSection ? lastSection.order + 1 : 1;

        // Create a new section with the computed order
        const createPageSection = this.pageSectionRepository.create({
            ...pageSectionDto,
            order: newOrder,
        });

        return await this.pageSectionRepository.save(createPageSection);
    }

    /**
     * Updates an existing page section.
     * @param {string} id - The ID of the page section to update.
     * @param {Partial<PageSectionDto>} pageSectionDto - Partial DTO containing updated fields.
     * @returns {Promise<PageSection>} The updated page section.
     * @throws {NotFoundException} If the page section is not found.
     */
    async updatePageSection(id: string, pageSectionDto: Partial<PageSectionDto>): Promise<PageSection> {
        const pageSection = await this.pageSectionRepository.findOne({ where: { id } });
        if (!pageSection) {
            throw new NotFoundException(`Page section with ID ${id} not found`);
        }

        // Merge the updates
        const updatedSection = this.pageSectionRepository.merge(pageSection, pageSectionDto);

        return await this.pageSectionRepository.save(updatedSection);
    }

    /**
     * Retrieves a page section by its ID, including its related entities.
     * @param {string} id - The ID of the page section.
     * @returns {Promise<PageSection>} The retrieved page section.
     * @throws {NotFoundException} If the page section is not found.
     */
    async getPageSectionById(id: string): Promise<PageSection> {
        let section = await this.pageSectionRepository.findOne({
            where: { id },
            relations: ['page', 'links'] // Add actual relation names here
        });
        if (!section) {
            throw new NotFoundException(`Page section with ID ${id} not found`);
        }
        return section;
    }

    /**
     * Deletes a page section by its ID.
     * @param {string} id - The ID of the page section to delete.
     * @returns {Promise<void>}
     * @throws {NotFoundException} If the page section is not found.
     */
    async deletePageSectionById(id: string): Promise<void> {
        let section = await this.getPageSectionById(id);
        if (!section) {
            throw new NotFoundException(`Page section with ID ${id} not found`);
        }

        await this.pageSectionRepository.remove(section);
    }

    /**
     * Reorders page sections based on the provided order.
     * @param {string[]} sectionIds - An array of page section IDs in the new order.
     * @returns {Promise<void>}
     * @throws {BadRequestException} If the provided array is empty.
     */
    async reorderPageSections(sectionIds: string[]): Promise<void> {
        if (!sectionIds || sectionIds.length === 0) {
            throw new BadRequestException('Section IDs array cannot be empty');
        }

        await this.pageSectionRepository.manager.transaction(async (transactionalEntityManager) => {
            for (let i = 0; i < sectionIds.length; i++) {
                await transactionalEntityManager.update(
                    PageSection,
                    { id: sectionIds[i] },
                    { order: i + 1 }
                );
            }
        });
    }
}
