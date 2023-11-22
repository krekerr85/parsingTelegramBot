import {
	Scene,
	SceneEnter,
	SceneLeave,
	Ctx,
	Hears,
	On,
	Message
} from 'nestjs-telegraf';
import { CHANNELS_SEARCH_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Back } from '../../Markup/Back';
import { ChannelsService } from '../services/channelSearch.service';
import { ParsingMenu } from 'src/Markup/ParsingMenu';
import { AnalyticsService } from '../services/analytic.service';

@Scene(CHANNELS_SEARCH_SCENE_ID)
export class ChannelsSearchScene {
	constructor(
		private channelsSearchService: ChannelsService,
		private analyticsService: AnalyticsService
	) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('ParsingUser.restrictions'), Back(ctx));
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Parsing.message'), ParsingMenu(ctx));
	}

	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Back.message');
	})
	async onLeaveHears(@Ctx() ctx: ScenesContext): Promise<void> {
		if (ctx.session.__scenes.state.isLoading) {
			await ctx.reply('Please wait, pasring is loading');
			return;
		}

		await ctx.scene.leave();
	}

	@Hears('/restart')
	async onRestart(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.leave();
	}

	@On('text')
	async onParseChannels(
		@Ctx() ctx: ScenesContext,
		@Ctx() ctx2: IContext,
		@Message('text') message: string
	) {
		if (ctx.session.__scenes.state.isLoading) {
			await ctx.reply(ctx2.i18.t('Loading.loading'));
			return;
		}
		const loadingMessage = await ctx.reply(ctx2.i18.t('Loading.message'));
		try {
			ctx.session.__scenes.state.isLoading = true;
			const channels = await this.channelsSearchService.getChannels(message);
			const channelsWithAt = channels.map(channel => `@${channel}`);
			const fileContent = channelsWithAt.join('\n');

			await ctx.replyWithDocument({
				source: Buffer.from(fileContent),
				filename: 'channels.txt'
			});

			return;
		} catch (err) {
			await this.analyticsService.createError('parseChannels');
			await ctx.reply(ctx2.i18.t('Loading.error'));
		} finally {
			ctx.session.__scenes.state.isLoading = false;
			await ctx.deleteMessage(loadingMessage.message_id);
		}
	}
}
