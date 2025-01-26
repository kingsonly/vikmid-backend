import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { User } from 'src/users/user.entity';

interface signupResponseInterface {
    email: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    isCreator: boolean,
    token: string
}
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    //@UseGuards(LocalAuthGuard)
    async signup(@Body() body: SignupDto) {

        let createUser = await this.authService.signup(body);
        if (createUser) {
            let response: signupResponseInterface = await this.authService.login(createUser)
            return response;

        }
        return {
            message: "could not create user at this time"
        };
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}
