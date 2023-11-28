import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ChannelSubscriptions } from '../../models/Channel.model';
import { ChannelMessage } from '../../models/ChannelMessage.model';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const fs = require('fs');
@Injectable()
export class VideoService {
	constructor(@InjectBot() private bot: Telegraf<Context>) {}

	async downloadVideo(file_id: string) {
		const fileLink = await this.bot.telegram.getFileLink(file_id);
		const fileName = `${uuidv4()}.mp4`;
		const filePath = `static/video/${fileName}`;

		try {
			const response = await axios.get(fileLink, { responseType: 'stream' });
			const stream = response.data;
			console.log(stream);
			await new Promise((resolve, reject) => {
				stream
					.pipe(fs.createWriteStream(filePath))
					.on('finish', resolve)
					.on('error', reject);
			});

			console.log('Файл успешно скачан и сохранен!');
			return { filePath, fileName };
		} catch (error) {
			console.error('Ошибка при скачивании файла:', error);
			return undefined;
		}
	}
	async downloadDocumentVideo(file_id: string) {
		const fileLink = await this.bot.telegram.getFileLink(file_id);
		const fileName = `${uuidv4()}.mp4`;
		const filePath = `static/video/${fileName}`;

		try {
			const response = await axios.get(fileLink, {
				responseType: 'arraybuffer'
			});
			const buffer = Buffer.from(response.data, 'binary');
			fs.writeFileSync(filePath, buffer);

			console.log('Файл успешно скачан и сохранен!');
			return { filePath, fileName };
		} catch (error) {
			console.error('Ошибка при скачивании файла:', error);
			return undefined;
		}
	}
}
