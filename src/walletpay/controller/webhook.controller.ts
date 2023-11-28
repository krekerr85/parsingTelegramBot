import { Body, Controller, Post, Res, Headers } from '@nestjs/common';
import { Response} from 'express';
import { WalletPayService } from '../services/walletpay.service';
@Controller('walletpay')
export class WalletPayWebhookController {
	constructor(private readonly walletPayService: WalletPayService) {}
	@Post()
	
	async handleOrderEvent(
		@Headers() headers: Record<string, string>,
		@Body() body: any[],
		@Res() res: Response,
	) {
		const clientIP = headers['x-real-ip'];
		const allowedIPs = ['172.255.248.12', '172.255.248.29'];
		console.log(body)
		if (!allowedIPs.includes(clientIP)) {
			res.status(403).send('Forbidden');
			return;
		  }
		
		try {
			for (const orderEvent of body) {
				const { payload } = orderEvent;
				const { externalId, customData, status } = payload;
				console.log(payload)
				if (status === 'EXPIRED'){
					await this.walletPayService.cancelPayment(externalId, customData);
				}else{
					await this.walletPayService.processPayment(externalId, customData);
				}
				
			}
			
			res.status(200).send('OK');
		} catch (error) {
			console.log(error);
			res.status(500).send('An error occurred');
		}
	}
}
