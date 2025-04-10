import { Module } from '@nestjs/common';
import { LinkInBioService } from './link-in-bio.service';
import { LinkInBioController } from './link-in-bio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { BioProfile } from './entity/bio-profile.entity';
import { Page } from './entity/page.entity';
import { PageSection } from './entity/page_section.entity';
import { Links } from './entity/links.entity';
import { LinkStats } from './entity/link-stats.entity';
import { SocialLinkStats } from './entity/social-link-stats.entity';
import { SocialLinks } from './entity/social-links.entity';
import { StorageService } from 'config/storage.provider';
import { HubModule } from 'src/hub/hub.module';
import { LinksController } from './links/links.controller';
import { LinksService } from './links/links.service';
import { PageSectionService } from './page-section/page-section.service';
import { PageSectionController } from './page-section/page-section.controller';
import { PagesService } from './pages/pages.service';
import { PagesController } from './pages/pages.controller';
import { SocialLinkController } from './social-link/social-link.controller';
import { SocialLinkService } from './social-link/social-link.service';
import { LinkStatsModule } from './link-stats/link-stats.module';
import { SocialLinkStatsService } from './social-link-stats/social-link-stats.service';
import { SocialLinkStatsModule } from './social-link-stats/social-link-stats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        User,
        BioProfile,
        Page,
        PageSection,
        Links,
        LinkStats,
        SocialLinkStats,
        SocialLinks

      ]),
    HubModule,
    LinkStatsModule,
    SocialLinkStatsModule
  ],
  providers: [LinkInBioService, StorageService, PagesService, PageSectionService, LinksService, SocialLinkService, SocialLinkStatsService,],
  controllers: [LinkInBioController, PagesController, PageSectionController, LinksController, SocialLinkController]
})
export class LinkInBioModule { }
