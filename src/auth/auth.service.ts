import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HubService } from 'src/hub/hub.service';
import { SignupDto } from './dto/signup.dto';
import { PlansService } from 'src/plans/plans.service';

interface loginResponseInterface {
    email: string,
    firstName: string,
    lastName: string,
    isActive: boolean,
    isCreator: boolean,
    token: string
}
interface usersInterface {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    planId: number,
    isCreator: boolean,
    isActive: boolean,
}

interface hubInterface {
    userId: number,
    title: string,
    hubUrl: string,
}


@Injectable()
export class AuthService {
    private rootUrl: string = "vikmid.com"
    constructor(
        private usersService: UsersService,
        private planService: PlansService,
        private hubService: HubService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {

        const payload = { email: user.email, sub: user.id };
        let token = this.jwtService.sign(payload);
        let data: any = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            isCreator: user.isCreator,
            plan: user.planId,
            token: token
        }

        // return {
        //     access_token: this.jwtService.sign(payload),
        // };
        return data
    }

    async signup(data: SignupDto) {
        let isActive: boolean = true
        const hashedPassword = await bcrypt.hash(data.password, 10);
        // confirm the plan, if the plan amount is > 0 then ensure not to activate the user till the user has paid
        let plan = this.planService.getPlanById(data.plan)
        if (!plan) {
            return false
        }
        if ((await plan).price > 0) {
            isActive = false
        }

        let userDetails: usersInterface = {
            email: data.email,
            password: hashedPassword,
            planId: data.plan,
            firstName: data.firstName,
            lastName: data.lastName,
            isCreator: true,
            isActive: isActive,

        }
 
        let user = await this.usersService.create(userDetails);
        if (user) {
            let hubDetails: hubInterface = {
                userId: user.id,
                title: data.hubName,
                hubUrl: `${data.url}.${this.rootUrl}`,

            }
            var hub = await this.hubService.create(hubDetails)


        }
        if (hub) {

            return user
        }
        return false

    }
}
