import { Controller, Get, ParseIntPipe, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaymentService } from 'src/payment/payment.service';
import { PlansService } from 'src/plans/plans.service';
import { CreatorsSubscriptionService } from './creators-subscription.service';
import { UsersService } from 'src/users/users.service';

@Controller('creators-subscription')
export class CreatorsSubscriptionController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly plansService: PlansService,
        private readonly creatorsSubscriptionService: CreatorsSubscriptionService,
        private readonly usersService: UsersService
    ) { }
    @Get("approve/:id/:plan")
    @UseGuards(JwtAuthGuard)
    async getSubscription(@Param('id', ParseIntPipe) id: number, @Param('plan', ParseIntPipe) plan: number, @Request() req) {
        let validatePayment: any = await this.paymentService.validatePayment(id)
        if (validatePayment.status !== "success") {
            console.log(validatePayment);
            return "Invalid Payment";
        }
        let user = req.user;
        console.log("user", user.userId);
        // check to see that amount paid is = to plan amount
        let getPlan = await this.plansService.getPlanById(plan);
        if (getPlan.price != validatePayment.data.amount) {
            return "Invalid Amount";
        }
        // create subscription
        let startDate = new Date(); // Current date (now)
        let endDate = new Date();
        endDate.setDate(startDate.getDate() + 30)
        let subscriptionData = {
            user: user.userId,
            planId: plan,
            startDate: startDate,
            endDate: endDate
        }
        let subscription = await this.creatorsSubscriptionService.create(subscriptionData);
        if (!subscription) {
            return "Error creating subscription";
        }

        // update user
        let updateUser = await this.usersService.update(user.userId, { isActive: true });
        if (!updateUser) {
            return "Error updating user";
        }
        return {
            status: "success",
            message: "Subscription created successfully"
        };
    }

}
