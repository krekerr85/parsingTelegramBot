import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Payments } from 'src/walletpay/models/Payments.model';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context, Markup } from 'telegraf';
import { UserService } from 'src/user/user.service';
import { Donates } from '../models/Donate.model';

@Injectable()
export class WalletPayService {
	constructor(
		@InjectModel('payments')
		private readonly paymentsModel: Model<Payments>,
		@InjectModel('donates')
		private readonly donatesModel: Model<Donates>,
		private readonly userService: UserService,
		@InjectBot() private bot: Telegraf<Context>
	) {}

	async createOrder(userId: number, dollarCost: number) {
		const existingPayment = await this.paymentsModel.findOne({
			userId: userId,
			status: 'success'
		});

		if (existingPayment) {
			await this.sendArchive(userId);
			return existingPayment;
		}

		const WALLET_PAY_API_KEY = process.env.WALLET_API;
		const RETURN_URL = process.env.BOT_URL;
		const FAIL_RETURN_URL = process.env.WALLET_PAY_URL;
		const tonCost = (await this.getPriceToncoinUSD(dollarCost)).toFixed(9);
		const amount = {
			currencyCode: 'TON',
			amount: String(tonCost)
		};
		const description = 'Payment for goods';
		const returnUrl = RETURN_URL;
		const failReturnUrl = FAIL_RETURN_URL;
		const customData = 'buy';
		const externalId = uuidv4();
		const timeoutSeconds = 60;
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
			const keyboard = Markup.inlineKeyboard([
				Markup.button.url(`👛 Wallet Pay`, paymentLink)
			]);
			const message = await this.bot.telegram.sendMessage(
				userId,
				`Для оплаты нажмите на кнопку.\nСтоимость ${tonCost} TON.`,
				keyboard
			);
			return await this.paymentsModel.create({
				tonCost,
				dollarCost,
				externalId,
				paymentLink,
				messageId: message.message_id,
				userId: customerTelegramUserId
			});
		} catch (error) {
			console.error('Failed to create payment link:', error);
			return null;
		}
	}

	async createDonateOrder(userId: number, tonCost: number) {
		const WALLET_PAY_API_KEY = process.env.WALLET_API;
		const RETURN_URL = process.env.BOT_URL;
		const FAIL_RETURN_URL = process.env.WALLET_PAY_URL;
		const amount = {
			currencyCode: 'TON',
			amount: String(tonCost)
		};
		const description = 'Payment for goods';
		const returnUrl = RETURN_URL;
		const failReturnUrl = FAIL_RETURN_URL;
		const customData = 'donate';
		const externalId = uuidv4();
		const timeoutSeconds = 60;
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
			const keyboard = Markup.inlineKeyboard([
				Markup.button.url(`👛 Wallet Pay`, paymentLink)
			]);
			const message = await this.bot.telegram.sendMessage(
				userId,
				`Для оплаты нажмите на кнопку.\nСтоимость ${tonCost} TON.`,
				keyboard
			);
			return await this.donatesModel.create({
				tonCost,
				externalId,
				messageId: message.message_id,
				paymentLink,
				userId: customerTelegramUserId
			});
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
					'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_TOKEN
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

	async processPayment(externalId: string, customData: string) {
		if (customData === 'buy') {
			const order = await this.findByExternalId(externalId);
			if (order) {
				order.status = 'success';
				await order.save();

				const userId = Number(order.userId);
				const user = await this.userService.findOne(userId);
				if (user) {
					await this.sendArchive(user.tgId);
					await this.bot.telegram.deleteMessage(userId, order.messageId);
				}
			}
		} else if (customData === 'donate') {
			const order = await this.donatesModel.findOne({ externalId });
			if (order) {
				order.status = 'success';
				await order.save();
				const { userId } = order;
				const user = await this.userService.findOne(userId);
				if (user) {
					await this.sendThanks(user.tgId);
					await this.bot.telegram.deleteMessage(userId, order.messageId);
				}
			}
		}
	}
	async cancelPayment(externalId: string, customData: string) {
		if (customData === 'buy') {
			const order = await this.findByExternalId(externalId);
			if (order) {
				order.status = 'canceled';
				await order.save();

				const userId = Number(order.userId);
				const user = await this.userService.findOne(userId);
				if (user) {
					await this.bot.telegram.sendMessage(userId, 'Истекло время оплаты!', {
						reply_to_message_id: order.messageId
					});
					await this.bot.telegram.deleteMessage(userId, order.messageId);
				}
			}
		} else if (customData === 'donate') {
			const order = await this.donatesModel.findOne({ externalId });
			if (order) {
				order.status = 'canceled';
				await order.save();

				const { userId } = order;
				const user = await this.userService.findOne(userId);
				if (user) {
					await this.bot.telegram.sendMessage(userId, 'Истекло время оплаты!', {
						reply_to_message_id: order.messageId
					});
					await this.bot.telegram.deleteMessage(userId, order.messageId);
				}
			}
		}
	}

	async sendArchive(userId: number) {
		const archiveFilePath = path.join(
			__dirname,
			'../../../static/program/twitris.zip'
		);
		fs.readFile(archiveFilePath, {}, async (err, data) => {
			if (!err) {
				console.log('received data: ' + data);
				await this.bot.telegram.sendDocument(
					userId,
					{
						source: data,
						filename: 'twitris.zip'
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

	async sendThanks(userId: number) {
		await this.bot.telegram.sendMessage(userId, 'Спасибо за вашу поддержку!');
	}

	async findByExternalId(externalId: string) {
		const walletPay = await this.paymentsModel.findOne({ externalId });
		return walletPay;
	}
}
