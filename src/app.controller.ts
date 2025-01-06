import { AppService } from './app.service';
import { Controller, Bind, Request, Post, UseGuards, Get } from '@nestjs/common';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
