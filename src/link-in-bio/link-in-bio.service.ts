import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BioProfile } from './entity/bio-profile.entity';
import { Page } from './entity/page.entity';
import { PageSection } from './entity/page_section.entity';
import { Links } from './entity/links.entity';
import { LinkStats } from './entity/link-stats.entity';
import { SocialLinks } from './entity/social-links.entity';
import { SocialLinkStats } from './entity/social-link-stats.entity';
import { UpdateBioProfileDto } from './dto/update-bio-profile.dto';
import { QueryRunner } from 'typeorm';
@Injectable()
export class LinkInBioService {

    constructor(
        @InjectRepository(BioProfile)
        private readonly bioProfileRepository: Repository<BioProfile>,

        @InjectRepository(Page)
        private readonly pageRepository: Repository<Page>,

        @InjectRepository(PageSection)
        private readonly pageSectionRepository: Repository<PageSection>,
    ) { }

    /**
     * Fetches the BioProfile with all its relations. If it doesn't exist, creates one.
     * @param hubId The hub ID associated with the BioProfile
     */


    async getOrCreateBioProfile(hubId: number) {
        const queryRunner = this.bioProfileRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let bioProfile = await queryRunner.manager.findOne(this.bioProfileRepository.target, {
                where: { hubId },
                relations: [
                    'pages',
                    'pages.sections',
                    'pages.sections.links',
                    'pages.sections.links.stats',
                    'socialLinks',
                    'socialLinks.stats',
                ],
            });

            if (bioProfile) {
                await queryRunner.release();
                return bioProfile;
            }

            // Create a new bio profile
            bioProfile = this.bioProfileRepository.create({
                hubId,
                displayName: null,
                profilePicture: null,
                banner: null,
                template: 1,
                themeColors: JSON.stringify({
                    "name": "Modern Dark",
                    "background": "#111827",
                    "text": "#F3F4F6",
                    "accent": "#8B5CF6"
                }),
                status: true,
            });

            bioProfile = await queryRunner.manager.save(bioProfile);

            // Create a default page
            const defaultPage = this.pageRepository.create({
                name: 'home',
                bioProfile,
                status: true,
            });
            const savedPage = await queryRunner.manager.save(defaultPage);

            // Create a default page section
            const defaultPageSection = this.pageSectionRepository.create({
                page: savedPage,
                title: 'default',
                order: 1,
                status: true,
            });
            await queryRunner.manager.save(defaultPageSection);

            // Commit transaction
            await queryRunner.commitTransaction();

            // Fetch and return the newly created bio profile with relations
            return await queryRunner.manager.findOne(this.bioProfileRepository.target, {
                where: { id: bioProfile.id },
                relations: [
                    'pages',
                    'pages.sections',
                    'pages.sections.links',
                    'pages.sections.links.stats',
                    'socialLinks',
                    'socialLinks.stats',
                ],
            });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    // async getOrCreateBioProfile(hubId: number) {
    //     let bioProfile = await this.bioProfileRepository.findOne({
    //         where: { hubId },
    //         relations: [
    //             'pages',
    //             'pages.sections',
    //             'pages.sections.links',
    //             'pages.sections.links.stats',
    //             'socialLinks',
    //             'socialLinks.stats',
    //         ],
    //     });

    //     // If bioProfile exists, return it
    //     if (bioProfile) return bioProfile;

    //     // Otherwise, create a new one
    //     bioProfile = this.bioProfileRepository.create({
    //         hubId,
    //         displayName: null,
    //         profilePicture: null,
    //         banner: null,
    //         template: 1,
    //         themeColors: JSON.stringify({
    //             "name": "Modern Dark",
    //             "background": "#111827",
    //             "text": "#F3F4F6",
    //             "accent": "#8B5CF6"
    //         }),
    //         status: true,
    //     });

    //     await this.bioProfileRepository.save(bioProfile);

    //     // Create a default page
    //     const defaultPage = this.pageRepository.create({
    //         name: 'home',
    //         bioProfile,
    //         status: true,
    //     });
    //     await this.pageRepository.save(defaultPage);

    //     // Create a default page section
    //     const defaultPageSection = this.pageSectionRepository.create({
    //         page: defaultPage,
    //         title: 'default',
    //         order: 1,
    //         status: true,
    //     });
    //     await this.pageSectionRepository.save(defaultPageSection);

    //     return this.bioProfileRepository.findOne({
    //         where: { id: bioProfile.id },
    //         relations: [
    //             'pages',
    //             'pages.sections',
    //             'pages.sections.links',
    //             'pages.sections.links.stats',
    //             'socialLinks',
    //             'socialLinks.stats',
    //         ],
    //     });
    // }

    async updateBioProfile(id: string, updateBioProfileDto: UpdateBioProfileDto): Promise<BioProfile> {
        const bioProfile = await this.bioProfileRepository.findOne({ where: { id } });

        if (!bioProfile) {
            throw new NotFoundException('BioProfile not found');
        }

        Object.assign(bioProfile, updateBioProfileDto);
        return await this.bioProfileRepository.save(bioProfile);
    }
    async getBioProfileById(id: string,): Promise<BioProfile> {
        const bioProfile = await this.bioProfileRepository.findOne({ where: { id } });
        if (!bioProfile) {
            throw new NotFoundException('BioProfile not found');
        }
        return bioProfile;
    }
}
