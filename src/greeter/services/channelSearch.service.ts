import {  Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ChannelsSearch } from 'src/models/ChannelsSearch.model';
import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
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
    console.log(channelsSet)
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
  
        // Используем селектор класса для поиска всех div-элементов с классом "tg-channel-wrapper" и "is-list"
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
  
        // Проверяем, есть ли еще страницы с результатами
        currentPage += 1;
  
        // Exit the loop if there are no more pages
      }
    } catch (error) {
      console.log('Страницы закончились');
    }
  
    return channels;
  }
}

// import { Telegraf } from "telegraf";
// import { Channels } from 'src/models/Channels.model';

// const query = 'фемдом';
// const baseUrl = `https://en.tgramsearch.com/search?query=${query}`;
// let currentPage = 1; // Текущая страница
// const channels = new Set<string>();

// // Параметры подключения к базе данных MongoDB
// const mongoUrl = "mongodb://127.0.0.1:27017/telegramChannel";

// Определение схемы и модели Mongoose

// async function saveChannelsToDatabase(query: string, channels: Set<string>): Promise<void> {
//   try {
//     const channel = channels({
//       query,
//       channels: Array.from(channels),
//     });
//     const res = await channel.save();
//     console.log("Каналы успешно сохранены в базе данных");
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function parsePage(url: string) {
//   try {
//     const response = await axios.get(url);
//     const $ = cheerio.load(response.data);

//     // Используем селектор класса для поиска всех div-элементов с классом "tg-channel-wrapper" и "is-list"
//     $(
//       ".tg-channel-wrapper.is-list .tg-channel .tg-onclick .tg-channel-link a"
//     ).each((index, element) => {
//       const link = $(element).attr("href");
//       const fullLink = `https://en.tgramsearch.com${link}`;
//       axios
//         .get(fullLink)
//         .then((response) => {
//           const $ = cheerio.load(response.data);
//           $(".app").each((index, element) => {
//             const link = $(element).attr("href");
//             const value = link.split("domain=")[1];
//             console.log(value);
//             channels.add(value);
//           });
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     });

//     // Проверяем, есть ли еще страницы с результатами
//     currentPage += 1;
//     await parsePage(`${baseUrl}&page=${currentPage}`);
//   } catch (error) {
//     console.log("Страницы закончились");
//     return channels;
//   }
// }

// mongoose
//   .connect(mongoUrl)
//   .then(() => {
//     console.log("Успешное подключение к базе данных");
//     const initialPageUrl = `${baseUrl}&page=${currentPage}`;
//     parsePage(initialPageUrl);
//   })
//   .catch((error) => {
//     console.log("Ошибка подключения к базе данных:", error);
//   });
