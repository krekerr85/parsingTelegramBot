import {
	Scene,
	SceneEnter,
	SceneLeave,
	Ctx,
	Hears,
	On,
	Message
} from 'nestjs-telegraf';
import { TIKTOK_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Back } from '../../Markup/Back';
import { Menu } from '../../Markup/Menu';
import { v4 as uuidv4 } from 'uuid';
import { TicTokDownloader } from '../../utils/TicTokDownloader';
import { AnalyticsService } from '../services/analytic.service';
import { DownLoadMenu } from 'src/Markup/DownLoadMenu';

@Scene(TIKTOK_SCENE_ID)
export class TikTocScene {
	private downloaderService: TicTokDownloader = new TicTokDownloader();

	constructor(private analyticsService: AnalyticsService) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Video.shortsMessage'), Back(ctx));
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.download'), DownLoadMenu(ctx));
	}

	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Back.message');
	})
	async onLeaveHears(@Ctx() ctx: ScenesContext): Promise<void> {
		if (ctx.session.__scenes.state.isLoading) {
			await ctx.reply('Please wait, video is loading');
			return;
		}

		await ctx.scene.leave();
	}

	@Hears('/restart')
	async onRestart(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.leave();
	}

	@On('text')
	async onDownloadShorts(
		@Ctx() ctx: ScenesContext,
		@Ctx() ctx2: IContext,
		@Message('text') message: string
	) {
		if (ctx.session.__scenes.state.isLoading) {
			await ctx.reply(ctx2.i18.t('Loading.loading'));
			return;
		}

		const isUrl = this.downloaderService.checkUrl(message);

		if (!isUrl) {
			await ctx.reply(ctx2.i18.t('UncorrectedLink.message'), Back(ctx2));
			return;
		}

		const loadingMessage = await ctx.reply(ctx2.i18.t('Loading.message'));

		try {
			ctx.session.__scenes.state.isLoading = true;
			const url = await this.downloaderService.downloadVideo(message);

			const filename = `${ctx.from.id}_${uuidv4()}.mp4`;

			await ctx.replyWithDocument({
				url,
				filename
			});

			await this.analyticsService.createAnalyticTikTok(
				ctx2.from.username || ctx2.from.first_name,
				message
			);

			return;
		} catch (err) {
			await this.analyticsService.createError('TikToc');
			await ctx.reply(ctx2.i18.t('Loading.error'));
		} finally {
			ctx.session.__scenes.state.isLoading = false;
			await ctx.deleteMessage(loadingMessage.message_id);
		}
	}
}
