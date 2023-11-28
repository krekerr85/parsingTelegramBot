import {
	Scene,
	SceneEnter,
	SceneLeave,
	Ctx,
	Hears,
	On,
	Message
} from 'nestjs-telegraf';
import { VIDEO_NOTE_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Back } from '../../Markup/Back';
import { ClassDownloader } from '../../utils/YouTubeDownloader.class';
import { v4 as uuidv4 } from 'uuid';
import { AnalyticsService } from '../services/analytic.service';
import { DownLoadMenu } from 'src/Markup/DownLoadMenu';
import * as fs from 'fs';
import * as path from 'path';
import { ConverterMenu } from 'src/Markup/ConverterMenu';
import { Telegraf } from 'telegraf';
import { VideoService } from '../services/video.service';

@Scene(VIDEO_NOTE_SCENE_ID)
export class VideoNoteScene {
	private downloaderService: ClassDownloader = new ClassDownloader();

	constructor(
		private analyticsService: AnalyticsService,
		private videoService: VideoService
	) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('VideoNote.restrictions'), Back(ctx));
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.download'), ConverterMenu(ctx));
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

	@On('video')
	async onVideoCircle(
		@Ctx() ctx: ScenesContext,
		@Ctx() ctx2: IContext,
		@Message('video') video
	) {
		if (ctx.session.__scenes.state.isLoading) {
			await ctx.reply(ctx2.i18.t('Loading.loading'));
			return;
		}

		const loadingMessage = await ctx.reply(ctx2.i18.t('Loading.message'));

		try {
			ctx.session.__scenes.state.isLoading = true;

			const duration = video.duration;
			const { width, height } = video;
			const minSide = Math.min(width, height);
			if (duration > 60) {
				await ctx.reply(ctx2.i18.t('VideoNote.duration'), Back(ctx2));
				return;
			}
			const { filePath, fileName } = await this.videoService.downloadVideo(
				video.file_id
			);

			const proccesVideo = await this.downloaderService.processVideoStream(
				filePath,
				fileName,
				minSide
			);

			await ctx.sendVideoNote({
				source: proccesVideo,
				filename: fileName
			});

			const directory = 'src/static/videos';
			const directoryDownload = 'static/video';
			fs.readdir(directory, (err, files) => {
				if (err) throw err;

				for (const file of files) {
					fs.unlink(path.join(directory, file), err => {
						if (err) throw err;
					});
				}
			});
			fs.readdir(directoryDownload, (err, files) => {
				if (err) throw err;

				for (const file of files) {
					fs.unlink(path.join(directoryDownload, file), err => {
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

	@On('animation')
	async onAnimationCircle(
		@Ctx() ctx: ScenesContext,
		@Ctx() ctx2: IContext,
		@Message('animation') animation
	) {
		if (ctx.session.__scenes.state.isLoading) {
			await ctx.reply(ctx2.i18.t('Loading.loading'));
			return;
		}

		const loadingMessage = await ctx.reply(ctx2.i18.t('Loading.message'));

		try {
			ctx.session.__scenes.state.isLoading = true;

			const duration = animation.duration;
			const { width, height } = animation;
			const minSide = Math.min(width, height);
			console.log(animation);
			if (duration > 60) {
				await ctx.reply(ctx2.i18.t('VideoNote.duration'), Back(ctx2));
				return;
			}
			const { filePath, fileName } = await this.videoService.downloadVideo(
				animation.file_id
			);

			const proccesVideo = await this.downloaderService.processVideoStream(
				filePath,
				fileName,
				minSide
			);

			await ctx.sendVideoNote({
				source: proccesVideo,
				filename: fileName
			});

			const directory = 'src/static/videos';
			const directoryDownload = 'static/video';
			fs.readdir(directory, (err, files) => {
				if (err) throw err;

				for (const file of files) {
					fs.unlink(path.join(directory, file), err => {
						if (err) throw err;
					});
				}
			});
			fs.readdir(directoryDownload, (err, files) => {
				if (err) throw err;

				for (const file of files) {
					fs.unlink(path.join(directoryDownload, file), err => {
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

	@On('document')
	async onFileCircle(
		@Ctx() ctx: ScenesContext,
		@Ctx() ctx2: IContext,
		@Message('document') document
	) {
		if (ctx.session.__scenes.state.isLoading) {
			await ctx.reply(ctx2.i18.t('Loading.loading'));
			return;
		}
		await ctx.reply(ctx2.i18.t('VideoNote.invalidFileType'));
				return;
		
	}
}
