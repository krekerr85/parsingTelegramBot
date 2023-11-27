import { Body, Controller, Post, Res, Headers, Req, Ip } from '@nestjs/common';
import { Response, Request } from 'express';
import { WalletPayService } from '../services/walletpay.service';
import * as crypto from 'crypto';

@Controller('walletpay')
export class WalletPayWebhookController {
	constructor(private readonly walletPayService: WalletPayService) {}
	@Post()
	async handleOrderEvent(
		@Headers() headers: Record<string, string>,
		@Body() body: any[],
		@Res() res: Response,
		request: Request,
	) {
		const { ip, method, originalUrl } = request;
		console.log(body, ip)
		const allowedIPs = ['172.255.248.12', '172.255.248.29'];
		if (!allowedIPs.includes(ip)) {
			res.status(403).send('Forbidden');
			return;
		  }
		
		try {
			for (const orderEvent of body) {
				const { payload } = orderEvent;
				const { externalId, customData } = payload;
				await this.walletPayService.processPayment(externalId, customData);
			}
			
			res.status(200).send('OK');
		} catch (error) {
			console.log(error);
			res.status(500).send('An error occurred');
		}
	}
}
