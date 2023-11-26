import {
	Scene,
	SceneEnter,
	SceneLeave,
	Ctx,
	Hears,
	On,
	Message
} from 'nestjs-telegraf';
import { LONGS_SCENE_ID, VIDEO_NOTE_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Back } from '../../Markup/Back';
import { ClassDownloader } from '../../utils/YouTubeDownloader.class';
import { v4 as uuidv4 } from 'uuid';
import { VideoMenu } from '../../Markup/VideoMenu';
import { AnalyticsService } from '../services/analytic.service';
import { DownLoadMenu } from 'src/Markup/DownLoadMenu';
import * as fs from 'fs';
import * as path from 'path';

@Scene(VIDEO_NOTE_SCENE_ID)
export class VideoNoteScene {
	private downloaderService: ClassDownloader = new ClassDownloader();

	constructor(private analyticsService: AnalyticsService) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('VideoNote.restrictions'), Back(ctx));
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.download'), DownLoadMenu(ctx));
	}
	//
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

			const isDuration = await this.downloaderService.checkVideoDuration(
				message,
				420
			);

			if (!isDuration) {
				await ctx.reply(ctx2.i18.t('VideoNote.duration'), Back(ctx2));
				return;
			}

			const { videoStream } =
				await this.downloaderService.downloadVideo(message);

			const filename = `${ctx.from.id}_${uuidv4()}`;
			const proccesVideo = await this.downloaderService.processVideoStream(
				videoStream,
				filename
			);
			console.log(proccesVideo);
			const res = await ctx.sendVideoNote(
				{
					source: proccesVideo,
					filename
				},
				{
					length: 360
				}
			);
			console.log(res);
			await this.analyticsService.createAnalyticLong(
				ctx2.from.username || ctx2.from.first_name,
				message
			);
			const directory = 'src/static/videos';
			fs.readdir(directory, (err, files) => {
				if (err) throw err;

				for (const file of files) {
					fs.unlink(path.join(directory, file), err => {
						if (err) throw err;
					});
				}
			});
			return;
		} catch (err) {
			console.log(err);
			await this.analyticsService.createError('video-note');
			await ctx.reply(ctx2.i18.t('Loading.error'));
		} finally {
			ctx.session.__scenes.state.isLoading = false;
			await ctx.deleteMessage(loadingMessage.message_id);
		}
	}
}
