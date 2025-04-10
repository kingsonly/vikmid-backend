import { Body, Post, Controller, Get, UseGuards, Request, Put, Param } from '@nestjs/common';
import { HubService } from './hub.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateHubDto } from './dto/update-hub.dto';

interface hubInterface {
    id: number;
    userId: number;
    title: string;
    hubUrl: string;
}
@Controller('hub')
export class HubController {
    constructor(private readonly hubService: HubService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req): Promise<hubInterface[]> {
        const creatorId = req.user.userId;
        let hubs: hubInterface[] = await this.hubService.findAllByCreator(creatorId)
        return hubs.map((hub) => ({
            id: hub.id,
            userId: hub.userId,
            title: hub.title,
            hubUrl: hub.hubUrl,
        }));
        //return hubs;
    }
    @Post('create')
    @UseGuards(JwtAuthGuard)
    async create(@Body() hubDto: any) {
        return;
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: number,
        @Body() updateHubDto: UpdateHubDto
    ) {
        return this.hubService.updateHub(id, updateHubDto)
    }

}