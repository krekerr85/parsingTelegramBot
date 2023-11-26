import { Body, Controller, Post, Res, Headers } from '@nestjs/common';
import { Response } from 'express';
import { WalletPayService } from '../services/walletpay.service';
import * as crypto from 'crypto';

@Controller('walletpay')
export class WalletPayWebhookController {
	constructor(private readonly walletPayService: WalletPayService) {}
	@Post()
	async handleOrderEvent(
		@Headers() headers: Record<string, string>,
		@Body() body: any[],
		@Res() res: Response
	) {
		try {
			const secretKey = process.env.WALLET_API;
			const signatureHeader = headers['walletpay-signature'];
			const timestampHeader = headers['walletpay-timestamp'];
			const requestMethod = 'POST';
			const requestPath = '/walletpay';
			const requestBody = JSON.stringify(body);
			const timestamp = Math.floor(Number(timestampHeader));
			const hmac = crypto.createHmac('sha256', secretKey);
			hmac.update(
				`${requestMethod}.${requestPath}.${timestamp}.${requestBody}`
			);
			const calculatedSignature = hmac.digest('base64');
			if (signatureHeader !== calculatedSignature) {
				throw new Error('Invalid signature');
			}
			for (const orderEvent of body) {
				const { payload } = orderEvent;
				const { externalId } = payload;
				await this.walletPayService.processPayment(externalId);
			}

			res.status(200).send('OK');
		} catch (error) {
			console.log(error);
			res.status(500).send('An error occurred');
		}
	}
}
