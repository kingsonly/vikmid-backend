import { Module } from '@nestjs/common';
import { LinkInBioService } from './link-in-bio.service';
import { LinkInBioController } from './link-in-bio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { LinkInBioProfile } from './entity/link-in-bio-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, LinkInBioProfile])],
  providers: [LinkInBioService],
  controllers: [LinkInBioController]
})
export class LinkInBioModule { }
