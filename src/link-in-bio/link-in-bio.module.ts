import { Module } from '@nestjs/common';
import { LinkInBioService } from './link-in-bio.service';
import { LinkInBioController } from './link-in-bio.controller';

@Module({
  providers: [LinkInBioService],
  controllers: [LinkInBioController]
})
export class LinkInBioModule {}
