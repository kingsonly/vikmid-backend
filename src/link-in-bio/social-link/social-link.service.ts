import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialLinks } from '../entity/social-links.entity';
import { SocialLinksDto } from './dto/social-links.dto';

@Injectable()
export class SocialLinkService {
    constructor(
        @InjectRepository(SocialLinks) private socialLinksRepository: Repository<SocialLinks>,
    ) { }

    /**
     * Creates a new social link and assigns it an order based on existing links.
     * @param {SocialLinksDto} socialLinksDto - The DTO containing social link details.
     * @returns {Promise<SocialLinks>} The newly created social link.
     * @throws {BadRequestException} If the link creation fails.
     */
    async createLink(socialLinksDto: SocialLinksDto): Promise<SocialLinks> {
        // let getPageSection = await this.pageSectionService.getPageSectionById(linksDto.pageSectionId);
        // if (!getPageSection) {
        //     throw new BadRequestException(`could not create a link`);
        // }
        const lastSocialLink = await this.socialLinksRepository.findOne({
            where: { bioProfileId: socialLinksDto.bioProfileId },
            order: { order: 'DESC' }, // Get the highest order
        });

        const newOrder = lastSocialLink ? lastSocialLink.order + 1 : 1;

        // Create a new link with the computed order
        const createSocialLink = this.socialLinksRepository.create({
            ...socialLinksDto,
            order: newOrder,
        });
        let saveSocialLink = this.socialLinksRepository.save(createSocialLink);
        if (!saveSocialLink) {
            throw new BadRequestException(`could not create a link`);
        }

        return saveSocialLink;
    }

    /**
     * Updates an existing social link by ID.
     * @param {string} id - The ID of the social link to update.
     * @param {Partial<SocialLinksDto>} socialLinksDto - The updated social link data.
     * @returns {Promise<SocialLinks>} The updated social link.
     * @throws {NotFoundException} If the social link is not found.
     */
    async updateSocialLink(id: string, socialLinksDto: Partial<SocialLinksDto>): Promise<SocialLinks> {
        const socialLink = await this.getSocialLinkById(id);

        Object.assign(socialLink, socialLinksDto);
        return await this.socialLinksRepository.save(socialLink);
    }

    /**
     * Reorders social links based on the given array of IDs.
     * @param {string[]} SocialLinkIds - The ordered array of social link IDs.
     * @returns {Promise<boolean>} Returns true if the reorder was successful.
     * @throws {BadRequestException} If the provided ID array is empty.
     */
    async reorderSocialLinks(SocialLinkIds: string[]): Promise<boolean> {
        if (!SocialLinkIds || SocialLinkIds.length === 0) {
            throw new BadRequestException('Social Link IDs array cannot be empty');
        }

        await this.socialLinksRepository.manager.transaction(async (transactionalEntityManager) => {
            for (let i = 0; i < SocialLinkIds.length; i++) {
                await transactionalEntityManager.update(
                    SocialLinks,
                    { id: SocialLinkIds[i] },
                    { order: i + 1 }
                );
            }
        });
        return true;
    }

    /**
     * Retrieves all social links associated with a bio profile ID.
     * @param {string} id - The bio profile ID.
     * @returns {Promise<SocialLinks[]>} An array of social links.
     * @throws {BadRequestException} If no social links are found.
     */
    async getLinksByBioProfileId(id: string): Promise<SocialLinks[]> {
        const socialLink = await this.socialLinksRepository.find({
            where: { bioProfileId: id },
            order: { order: 'ASC' },
        });
        if (!socialLink) {
            throw new BadRequestException(`no link with the this link ${id} ID`);
        }
        return socialLink;
    }

    /**
     * Retrieves a social link by its ID.
     * @param {string} id - The ID of the social link to retrieve.
     * @returns {Promise<SocialLinks>} The social link object.
     * @throws {NotFoundException} If the social link is not found.
     */
    async getSocialLinkById(id: string): Promise<SocialLinks> {
        const socialLink = await this.socialLinksRepository.findOne({ where: { id } })
        if (!socialLink) {
            throw new NotFoundException('Social link not found');
        }
        return socialLink
    }

    /**
     * Deletes a social link by its ID.
     * @param {string} id - The ID of the social link to delete.
     * @returns {Promise<SocialLinks>} The deleted social link.
     * @throws {BadRequestException} If the social link does not exist.
     */
    async deleteSocialLink(id: string) {
        const getSocialLink = await this.getSocialLinkById(id);
        if (!getSocialLink) {
            throw new BadRequestException(`no social link with the this link ${id} ID`);
        }
        return await this.socialLinksRepository.remove(getSocialLink);
    }
}
