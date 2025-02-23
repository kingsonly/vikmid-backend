import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Links } from '../entity/links.entity';
import { LinksDto } from './dto/links.dto';
import { PageSectionService } from '../page-section/page-section.service';
import { StorageService } from 'config/storage.provider';

@Injectable()
export class LinksService {
    constructor(
        @InjectRepository(Links) private linksRepository: Repository<Links>,
        private readonly pageSectionService: PageSectionService,
        private readonly storageService: StorageService
    ) { }

    /**
     * Creates a new link within a page section.
     * @param {LinksDto} linksDto - The DTO containing link data.
     * @returns {Promise<Links>} - The newly created link.
     * @throws {BadRequestException} - If the page section does not exist or if the link cannot be created.
     */
    async createLink(linksDto: LinksDto): Promise<Links> {
        let getPageSection = await this.pageSectionService.getPageSectionById(linksDto.pageSectionId);
        if (!getPageSection) {
            throw new BadRequestException(`could not create a link`);
        }
        const lastLink = await this.linksRepository.findOne({
            where: { pageSectionId: linksDto.pageSectionId },
            order: { order: 'DESC' }, // Get the highest order
        });

        const newOrder = lastLink ? lastLink.order + 1 : 1;

        // Create a new link with the computed order
        const createPageSectionLink = this.linksRepository.create({
            ...linksDto,
            order: newOrder,
        });
        let saveLink = this.linksRepository.save(createPageSectionLink);
        if (!saveLink) {
            throw new BadRequestException(`could not create a link`);
        }

        return saveLink;
    }

    /**
     * Updates an existing link.
     * @param {string} id - The ID of the link to update.
     * @param {Partial<LinksDto>} linksDto - The new data to update the link with.
     * @param {Links} link - The existing link entity.
     * @returns {Promise<Links>} - The updated link.
     */
    async updateLink(id: string, linksDto: Partial<LinksDto>, link: Links): Promise<Links> {
        Object.assign(link, linksDto);
        return await this.linksRepository.save(link);
    }

    /**
     * Retrieves a link by its ID.
     * @param {string} id - The ID of the link to retrieve.
     * @returns {Promise<Links>} - The retrieved link.
     * @throws {BadRequestException} - If no link is found with the given ID.
     */
    async getLinkById(id: string): Promise<Links> {
        const link = await this.linksRepository.findOne({
            where: { id },
        });
        if (!link) {
            throw new BadRequestException(`no link with the this link ${id} ID`);
        }
        return link;
    }

    /**
     * Retrieves all links associated with a given page section.
     * @param {string} id - The ID of the page section.
     * @returns {Promise<Links[]>} - An array of links sorted by order.
     * @throws {BadRequestException} - If no links are found for the given page section.
     */
    async getLinksByPageSectionId(id: string): Promise<Links[]> {
        const link = await this.linksRepository.find({
            where: { pageSectionId: id },
            order: { order: 'ASC' },
        });
        if (!link) {
            throw new BadRequestException(`no link with the this link ${id} ID`);
        }
        return link;
    }

    /**
     * Reorders links based on the provided array of link IDs.
     * @param {string[]} linkIds - An array of link IDs in the desired order.
     * @returns {Promise<boolean>} - Returns `true` if the reordering was successful.
     * @throws {BadRequestException} - If the provided array is empty.
     */
    async reorderLinks(linkIds: string[]): Promise<boolean> {
        if (!linkIds || linkIds.length === 0) {
            throw new BadRequestException('Link IDs array cannot be empty');
        }

        await this.linksRepository.manager.transaction(async (transactionalEntityManager) => {
            for (let i = 0; i < linkIds.length; i++) {
                await transactionalEntityManager.update(
                    Links,
                    { id: linkIds[i] },
                    { order: i + 1 }
                );
            }
        });
        return true;
    }

    /**
     * Deletes a link by its ID.
     * @param {string} id - The ID of the link to delete.
     * @returns {Promise<Links>} - The deleted link.
     * @throws {BadRequestException} - If no link is found with the given ID.
     */
    async deleteLink(id: string) {
        const getLink = await this.getLinkById(id);
        if (!getLink) {
            throw new BadRequestException(`no link with the this link ${id} ID`);
        }
        if (getLink.image) {
            await this.storageService.deleteFile(getLink.image);
        }
        return await this.linksRepository.remove(getLink);
    }
}
