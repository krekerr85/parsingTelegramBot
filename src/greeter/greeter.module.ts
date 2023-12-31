import { Module } from '@nestjs/common';
import { GreeterUpdate } from './greeter.update';
import { ShortsScene } from './scenes/shorts.scene';
import { TikTocScene } from './scenes/tik-toc.scene';
import { AudioScene } from './scenes/audio.scene';
import { LongScene } from './scenes/long.scene';
import { MongooseModule } from '@nestjs/mongoose';
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
import { ParamsSchema } from 'src/models/Params.model';
import { ParamsService } from './services/params.service';
import { SubsActivateScene } from './scenes/subsActivate.scene';
import { DonateScene } from './scenes/donate.scene';
import { VideoService } from './services/video.service';
import { PriceSetScene } from './scenes/priceSet.scene';

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
			},
			{
				name: 'params',
				schema: ParamsSchema
			}
		]),
		GramModule,
		WalletPayModule,
		UserModule
	],
	providers: [
		ChannelsService,
		VideoService,
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
		ParamsService,
		DescriptionScene,
		SubsActivateScene,
		PriceSetScene,
		DonateScene,
		BuyScene
		//Telegraf
	]
})
export class GreeterModule {}
//
