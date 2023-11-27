import { Injectable } from '@nestjs/common';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import input from 'input';

@Injectable()
export class GramService {
	private apiId = 21530097;
	private apiHash = '66dc2c88fbf0b1b5a3dbec15b1784252';
	private stringSession = new StringSession(
		process.env.SESSION
	);
	private client;
	constructor() {
		this.client = new TelegramClient(
			this.stringSession,
			this.apiId,
			this.apiHash,
			{}
		);
		this.start();
	}
	async start() {
		await this.client.start({
			phoneNumber: async () => await input.text('number ?'),
			password: async () => await input.text('password?'),
			phoneCode: async () => await input.text('Code ?'),
			onError: err => console.log(err)
		});
		console.log(this.client.session.save());
	}
	async searchUsers(channel: string) {
		await this.client.connect(); // This assumes you have already authenticated with .start()

		const limit = 200; // Maximum limit per request
		let offset = 0; // Initial offset

		const participants = [];

		while (true) {
			const result = await this.client.invoke(
				new Api.channels.GetParticipants({
					channel: channel,
					filter: new Api.ChannelParticipantsRecent(),
					offset: offset,
					limit: limit,
					//@ts-ignore
					hash: BigInt('-4156887774564')
				})
			);
			const users = result.users;
			participants.push(...users);

			if (users.length < limit - 1) {
				break; // Break the loop if we have fetched all the participants
			}

			offset += limit; // Increment the offset for the next request
		}
		return participants;
	}
}
