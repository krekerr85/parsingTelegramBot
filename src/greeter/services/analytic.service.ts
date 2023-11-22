import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/User.model';
import { Analytics } from '../../models/Analytics.model';

@Injectable()
export class AnalyticsService {
	constructor(
		@InjectModel('user') private userModel: Model<User>,
		@InjectModel('error') private errorModel: Model<Error>,
		@InjectModel('analytic') private analyticModel: Model<Analytics>
	) {}

	async createAnalyticShorts(userName: string, link: string): Promise<void> {
		const shorts = await this.analyticModel.create({
			userName: userName,
			link: link,
			type: 'shorts'
		});
		await shorts.save();
	}

	async createAnalyticAudio(userName: string, link: string): Promise<void> {
		try {
			const audio = new this.analyticModel({
				userName: userName,
				link: link,
				type: 'audio'
			});
			await audio.save();
		} catch (err) {
			throw err;
		}
	}

	async createAnalyticLong(userName: string, link: string): Promise<void> {
		const long = await this.analyticModel.create({
			userName: userName,
			link: link,
			type: 'long'
		});
		await long.save();
	}

	async createAnalyticTikTok(userName: string, link: string): Promise<void> {
		const tiktok = await this.analyticModel.create({
			userName: userName,
			link: link,
			type: 'tiktok'
		});
		await tiktok.save();
	}

	async createError(type: string): Promise<void> {
		const error = await this.errorModel.create({
			type
		});
		await error.save(); //
	}

	async getFullAnalytics(): Promise<string> {
		const countUsers = await this.userModel.countDocuments();
		const allErrors = await this.errorModel.countDocuments();
		const allDownloads = await this.analyticModel.countDocuments();
		const downloadsShorts = await this.analyticModel.countDocuments({
			type: 'shorts'
		});
		const downloadsLong = await this.analyticModel.countDocuments({
			type: 'long'
		});
		const downloadsAudio = await this.analyticModel.countDocuments({
			type: 'audio'
		});
		const downloadsTikTok = await this.analyticModel.countDocuments({
			type: 'tiktok'
		});
		const usersBy24Hours = await this.userModel.countDocuments({
			lastActivity: {
				$gte: Date.now() - 24 * 60 * 60 * 1000
			}
		});

		const usersBy7Days = await this.userModel.countDocuments({
			lastActivity: {
				$gte: Date.now() - 7 * 24 * 60 * 60 * 1000
			}
		});

		return `Всего пользователей: ${countUsers}\nЗа последние 24 часа: ${usersBy24Hours}\nЗа последние 7 дней: ${usersBy7Days}\nВсего загрузок: ${allDownloads}\nЗагрузок shorts: ${downloadsShorts}\nЗагрузок аудио: ${downloadsAudio}\nЗагрузок длинных видео: ${downloadsLong}\nЗагрузок TikTok: ${downloadsTikTok}\nВсего ошибок: ${allErrors}`;
	}
}
