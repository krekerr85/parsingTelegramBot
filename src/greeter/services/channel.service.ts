import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ChannelSubscriptions } from '../../models/Channel.model';
import { ChannelMessage } from '../../models/ChannelMessage.model';

@Injectable()
export class ChannelService {
	constructor(
		@Inject('channel')
		private readonly channelModel: Model<ChannelSubscriptions>,
		@Inject('channelMessage')
		private readonly channelMessageModel: Model<ChannelMessage>
	) {}

	async addChannelSubscription(chatId: string) {
		const newChannel = await this.channelModel.create({
			chatId
		});
		await newChannel.save();
		return;
	}

	async getChannelSubscriptions(): Promise<ChannelSubscriptions[]> {
		return this.channelModel.find();
	}

	async createMessage(message: string): Promise<void> {
		const channelMessage = await this.channelMessageModel.findOne({
			index: 1
		});

		if (channelMessage) {
			channelMessage.message = message;
			await channelMessage.save();
			return;
		}

		const newMessage = await this.channelMessageModel.create({
			message,
			index: 1
		});
		await newMessage.save();
		return;
	}
}
