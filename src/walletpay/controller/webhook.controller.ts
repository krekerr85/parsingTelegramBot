import { Body, Controller, Post, Res, Headers, Req, Ip } from '@nestjs/common';
import { Response} from 'express';
import { WalletPayService } from '../services/walletpay.service';
import { RealIP } from 'nestjs-real-ip';
@Controller('walletpay')
export class WalletPayWebhookController {
	constructor(private readonly walletPayService: WalletPayService) {}
	@Post()
	
	async handleOrderEvent(
		@Headers() headers: Record<string, string>,
		@Body() body: any[],
		@Res() res: Response,
		@RealIP() ip: string
	) {
		console.log(ip)
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
