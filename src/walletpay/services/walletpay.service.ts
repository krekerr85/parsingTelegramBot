import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Payments } from 'src/walletpay/models/Payments.model';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';

import * as fs from 'fs';
import * as path from 'path';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WalletPayService {
	constructor(
		@InjectModel('payments')
		private readonly paymentsModel: Model<Payments>,
		private readonly userService: UserService,
		@InjectBot() private bot: Telegraf<Context>
	) {}

	async createOrder(userId: number) {
		const existingPayment = await this.paymentsModel.findOne({ userId: userId });

		if (existingPayment) {
		  this.sendArchive(userId);
		  return;
		}

		const WALLET_PAY_API_KEY = 'mDsCBC9DEMrbmZwwXXYamfnGSCG8XWZP6d6F';
		const RETURN_URL = 'https://t.me/parse_krekerr_bot';
		const FAIL_RETURN_URL = 'https://t.me/wallet';
		const dollarCost = 0.01;
		const tonCost = (await this.getPriceToncoinUSD(dollarCost)).toFixed(9);
		console.log(tonCost, 'tonCost');
		const amount = {
			currencyCode: 'TON',
			amount: String(tonCost)
		};
		const description = 'Payment for goods';
		const returnUrl = RETURN_URL;
		const failReturnUrl = FAIL_RETURN_URL;
		const customData = null;
		const externalId = uuidv4();
		const timeoutSeconds = 3600;
		const customerTelegramUserId = String(userId);

		const url = 'https://pay.wallet.tg/wpay/store-api/v1/order';
		const headers = {
			'Wpay-Store-Api-Key': WALLET_PAY_API_KEY,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		};
		const data = {
			amount,
			description,
			returnUrl,
			failReturnUrl,
			customData,
			externalId,
			timeoutSeconds,
			customerTelegramUserId
		};

		try {
			const response = await axios.post(url, data, { headers });
			const paymentLink = response.data.data.payLink;
			console.log(response.data);
			const res = await this.paymentsModel.create({
				tonCost,
				dollarCost,
				externalId,
				userId: customerTelegramUserId
			});
			console.log(res);
			this.sendArchive(userId);
			return { tonCost, paymentLink };
		} catch (error) {
			console.error('Failed to create payment link:', error);
			return null;
		}
	}
	async getPriceToncoinUSD(dollarCost: number): Promise<number> {
		const response = await axios.get(
			'https://pro-api.coinmarketcap.com/v2/tools/price-conversion',
			{
				params: {
					amount: dollarCost,
					symbol: 'TON'
				},
				headers: {
					'X-CMC_PRO_API_KEY': 'a13640b8-1d2b-495e-ba36-e0588527bbb1' // Замените YOUR_API_KEY на ваш ключ API CoinMarketCap
				}
			}
		);

		const data = response.data;
		const toncoinData = data.data.find(
			(item: any) => item.symbol === 'TON' && item.name === 'Toncoin'
		);
		const toncoinPriceUSD = toncoinData.quote.USD.price;

		return toncoinPriceUSD;
	}

	async processPayment(externalId: string) {
		const order = await this.findByExternalId(externalId);
		if (order) {
			order.status = 'success';
			await order.save();

			const { userId } = order;
			const user = await this.userService.findById(userId);
			if (user) {
				await this.sendArchive(user.tgId);
			}
		}
	}
	async sendArchive(userId: number) {
		const archiveFilePath = path.join(
			__dirname,
			'../../../static/program/twitris_bot.zip'
		);
		fs.readFile(archiveFilePath, {}, (err, data) => {
			if (!err) {
				console.log('received data: ' + data);
				this.bot.telegram.sendDocument(
					userId,
					{
						source: data,
						filename: 'twitris_bot.zip'
					},
					{
						caption: 'Спасибо за покупку!'
					}
				);
			} else {
				console.log(err);
			}
		});
	}

	async findByExternalId(externalId: string) {
		const walletPay = await this.paymentsModel.findOne({ externalId });
		return walletPay.toObject();
	}
}
