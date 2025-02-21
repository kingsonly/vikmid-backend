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

      ])
  ],
  providers: [LinkInBioService, StorageService],
  controllers: [LinkInBioController]
})
export class LinkInBioModule { }
