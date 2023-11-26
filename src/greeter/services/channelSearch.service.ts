import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ChannelsSearch } from 'src/models/ChannelsSearch.model';
import axios from 'axios';
import cheerio from 'cheerio';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ChannelsService {
	private baseUrl = `https://en.tgramsearch.com/search?query=`;
	constructor(
		@InjectModel('channelsSearch') private channelsModel: Model<ChannelsSearch>
	) {}

	async getChannels(query: string) {
		const queryResult = (await this.channelsModel.find({ query }))[0];

		if (!queryResult) {
			return (await this.addChannels(query)).channels;
		}
		const channelList = queryResult.channels;
		return channelList;
	}
	async addChannels(query: string) {
		const channelsSet = await this.parsePage(query);
		console.log(channelsSet);
		const channels = [...channelsSet];
		const newChannels = await this.channelsModel.create({
			query,
			channels
		});
		const res = await newChannels.save();
		return res;
	}

	async parsePage(query: string) {
		const channels = new Set();
		let currentPage = 1;

		try {
			while (true) {
				const url = `${this.baseUrl}?=${query}&page=${currentPage}`;
				const response = await axios.get(url);
				const $ = cheerio.load(response.data);
				$(
					'.tg-channel-wrapper.is-list .tg-channel .tg-onclick .tg-channel-link a'
				).each((index, element) => {
					const link = $(element).attr('href');
					const fullLink = `https://en.tgramsearch.com${link}`;
					axios
						.get(fullLink)
						.then(response => {
							const $ = cheerio.load(response.data);
							$('.app').each((index, element) => {
								const link = $(element).attr('href');
								const value = link.split('domain=')[1];
								if (value) {
									channels.add(value);
								}
							});
						})
						.catch(error => {
							console.log(error);
						});
				});
				currentPage += 1;
			}
		} catch (error) {
			console.log('Страницы закончились');
		}

		return channels;
	}
}
