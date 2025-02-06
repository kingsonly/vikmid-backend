import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PlansService } from './plans.service';
import { Plan } from './plans.entity';
@Controller('plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) { }
    @Get('getplan/:id')
    async getPlan(@Param('id', ParseIntPipe) id: number): Promise<Plan> {
        return this.plansService.getPlanById(id);
    }
}
