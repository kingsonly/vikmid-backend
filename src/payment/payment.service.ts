import { Injectable } from '@nestjs/common';
//import { Flutterwave } from 'flutterwave-node-v3';


@Injectable()
export class PaymentService {
    async validatePayment(id: number) {
        const Flutterwave = require('flutterwave-node-v3');
        const flw = new Flutterwave("FLWPUBK_TEST-4c4bcdea43786e3492bf1832eceb741c-X", "FLWSECK_TEST-6b62830102f1115100ae48183b99c7aa-X");
        const payload = {
            id: id //This is the transaction unique identifier. It is returned in the initiate transaction call as data.id
        }
        return await flw.Transaction.verify(payload)
    }
}
