import { Module } from '@nestjs/common';
import { GreeterUpdate } from './greeter.update';
import { ShortsScene } from './scenes/shorts.scene';
import { TikTocScene } from './scenes/tik-toc.scene';
import { AudioScene } from './scenes/audio.scene';
import { LongScene } from './scenes/long.scene';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from '../models/Admin.model';
import { UserSchema } from '../models/User.model';
import { ErrorSchema } from '../models/Error.model';
import { ChannelSubscriptionsSchema } from '../models/Channel.model';
import { UserService } from './services/user.service';
import { AnalyticsScene } from './scenes/analytics.scene';
import { NewsletterScene } from './scenes/newsletter.scene';
import { AnalyticsService } from './services/analytic.service';
import { AnalyticsSchema } from '../models/Analytics.model';
import { ChannelMessageSchema } from '../models/ChannelMessage.model';
import { ExaminationWizardScene } from './scenes/examination.scene';
import { ChannelsService } from './services/channelSearch.service';
import { ChannelsSchema } from 'src/models/ChannelsSearch.model';
import { ChannelsSearchScene } from './scenes/channelsSearch.scene';
//import { Telegraf } from 'telegraf';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'admin',
				schema: AdminSchema
			},
			{
				name: 'user',
				schema: UserSchema
			},
			{
				name: 'error',
				schema: ErrorSchema
			},
			{
				name: 'analytic',
				schema: AnalyticsSchema
			},
			{
				name: 'channel',
				schema: ChannelSubscriptionsSchema
			},
			{
				name: 'channelMessage',
				schema: ChannelMessageSchema
			},
			{
				name: 'channelsSearch',
				schema: ChannelsSchema
			}
		])
	],
	providers: [
		ChannelsService,
		GreeterUpdate,
		ShortsScene,
		TikTocScene,
		AudioScene,
		LongScene,
		UserService,
		AnalyticsScene,
		NewsletterScene,
		ExaminationWizardScene,
		ChannelsSearchScene,
		AnalyticsService,
		//Telegraf
	]

	//exports: [UserService]
})
export class GreeterModule {}
//
