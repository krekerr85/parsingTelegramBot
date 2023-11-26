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

import { AnalyticsScene } from './scenes/analytics.scene';
import { NewsletterScene } from './scenes/newsletter.scene';
import { AnalyticsService } from './services/analytic.service';
import { AnalyticsSchema } from '../models/Analytics.model';
import { ChannelMessageSchema } from '../models/ChannelMessage.model';
import { ExaminationWizardScene } from './scenes/examination.scene';
import { ChannelsService } from './services/channelSearch.service';
import { ChannelsSchema } from 'src/models/ChannelsSearch.model';
import { ChannelsSearchScene } from './scenes/channelsSearch.scene';
import { ChannelUserSearchScene } from './scenes/channelUserSearch.scene';
import { GramModule } from 'src/gram/gram.module';
import { VideoNoteScene } from './scenes/video-note.scene';
import { ChatScene } from './scenes/chat.scene';
import { BuyScene } from './scenes/buy.scene';
import { DescriptionScene } from './scenes/description.scene';
import { WalletPayModule } from 'src/walletpay/walletpay.module';
import { UserModule } from 'src/user/user.module';
//import { Telegraf } from 'telegraf';

@Module({
	imports: [
		MongooseModule.forFeature([
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
		]),
		GramModule,
		WalletPayModule,
		UserModule
	],
	providers: [
		ChannelsService,
		GreeterUpdate,
		ShortsScene,
		TikTocScene,
		AudioScene,
		VideoNoteScene,
		ChatScene,
		LongScene,
		AnalyticsScene,
		NewsletterScene,
		ExaminationWizardScene,
		ChannelsSearchScene,
		ChannelUserSearchScene,
		AnalyticsService,
		DescriptionScene,
		BuyScene
		//Telegraf
	]
})
export class GreeterModule {}
//
