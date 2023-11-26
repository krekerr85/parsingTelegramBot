import {
	Action,
	Ctx,
	Hears,
	Next,
	On,
	Start,
	Update,
	Use
} from 'nestjs-telegraf';
import { IContext, ScenesContext } from '../interfaces/context.interface';
import { Menu } from '../Markup/Menu';
import {
	ANALYTICS_SCENE_ID,
	AUDIO_SCENE_ID,
	BUY_SCENE_ID,
	CHANNELS_SEARCH_SCENE_ID,
	CHANNEL_USER_SEARCH_SCENE_ID,
	CHAT_SCENE_ID,
	DESCRIPTION_SCENE_ID,
	EXAMINATION_SCENE_ID,
	LONGS_SCENE_ID,
	NEWSLETTER_SCENE_ID,
	SHORTS_SCENE_ID,
	TIKTOK_SCENE_ID,
	VIDEO_NOTE_SCENE_ID
} from '../app.constants';
import { ChooseLang } from '../Markup/ChooseLang';
import { VideoMenu } from '../Markup/VideoMenu';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TelegrafExceptionFilter } from './common/filtres/telegraf-exception.filter';

import { AdminMenu } from '../Markup/AdminMenu';
import { AdminGuard } from './common/AdminGuard';
import { ChannelMenu } from '../Markup/ChannelMenu';
import { DownLoadMenu } from 'src/Markup/DownLoadMenu';
import { ConverterMenu } from 'src/Markup/ConverterMenu';
import { ParsingMenu } from 'src/Markup/ParsingMenu';
import {NewsLetterMenu} from 'src/Markup/NewsLetterMenu';
import { UserService } from 'src/user/user.service';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class GreeterUpdate {
	constructor(
		private userService: UserService //private readonly bot: Telegraf<IContext>
	) {}

	@Use()
	async use(@Ctx() ctx: IContext, @Next() next: () => Promise<void>) {
		const {
			from: { id, username }
		} = ctx;

		const user = await this.userService.findOne(id);
		ctx.session.isAdmin = await this.userService.isAdmin(id);

		if (!user) {
			await this.userService.create({
				tgId: id,
				username,
				lastActivity: new Date()
			});
		} else {
			await this.userService.update(id);
		}

		await next();
	}

	@Start()
	async onStart(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('ChooseLang.chooseMessage'), ChooseLang());
	}

	@Action('ru')
	async onRu(@Ctx() ctx: IContext): Promise<void> {
		ctx.i18.setLocale('ru');
		await ctx.answerCbQuery();
		await ctx.deleteMessage();
		await ctx.reply(ctx.i18.t('Hello.message'), Menu(ctx));
	}

	@Action('en')
	async onEn(@Ctx() ctx: IContext): Promise<void> {
		ctx.i18.setLocale('en');
		await ctx.answerCbQuery();
		await ctx.deleteMessage();
		await ctx.reply(ctx.i18.t('Hello.message'), Menu(ctx));
	}

	@Hears('/restart')
	async onRestart(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Hello.message'), Menu(ctx));
	}

	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('ChooseLang.message');
	})
	async onHello(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('ChooseLang.chooseMessage'), ChooseLang());
	}

	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Long.message');
	})
	async hearsLongs(@Ctx() ctx: ScenesContext) {
		await ctx.scene.enter(LONGS_SCENE_ID);
		return;
	}

	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Shorts.message');
	})
	async hearsShorts(@Ctx() ctx: ScenesContext) {
		await ctx.scene.enter(SHORTS_SCENE_ID);
		return;
	}

	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Audio.message');
	})
	async hearsAudio(@Ctx() ctx: ScenesContext) {
		await ctx.scene.enter(AUDIO_SCENE_ID);
		return;
	}

	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('VideoNote.message');
	})
	async hearsVideoNote(@Ctx() ctx: ScenesContext) {
		await ctx.scene.enter(VIDEO_NOTE_SCENE_ID);
		return;
	}

	@UseGuards(AdminGuard)
	@Hears('Админка 🤖')
	async onAdmin(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply('Выбери в меню, что ты хочешь сделать.', AdminMenu(ctx));
	}

	@UseGuards(AdminGuard)
	@Hears('Аналитика 👾')
	async onAnalytics(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(ANALYTICS_SCENE_ID);
		return;
	}

	@UseGuards(AdminGuard)
	@Hears('Проверка на подписку 📄')
	async onChannel(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply('Выбери в меню, что ты хочешь сделать.', ChannelMenu(ctx));
		return;
	}

	@UseGuards(AdminGuard)
	@Hears('Сделать рассылку 👥')
	async onNewsletter(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(NEWSLETTER_SCENE_ID);
		return;
	}

	@UseGuards(AdminGuard)
	@Hears('Добавить проверку')
	async onExamination(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(EXAMINATION_SCENE_ID);
		return;
	}

	@Hears('TikTok 💃')
	async onTikTok(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(TIKTOK_SCENE_ID);
		return;
	}

	@Hears('Парсинг')
	async onParse(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Parsing.message'), ParsingMenu(ctx));
		return;
	}

	@Hears('Видео ▶️')
	async onVideo(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.video'), VideoMenu(ctx));
		return;
	}

	@Hears('Скачать')
	async onDownLoad(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.download'), DownLoadMenu(ctx));
		return;
	}
	@Hears('Конвертер')
	async onConvert(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Convert.message'), ConverterMenu(ctx));
		return;
	}

	@Hears('Каналы/Чаты')
	async onСhannels(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(CHANNELS_SEARCH_SCENE_ID);
		return;
	}

	@Hears('Участники')
	async onUsers(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(CHANNEL_USER_SEARCH_SCENE_ID);
		return;
	}

	@Hears('Рассылка')
	async onNewsLetter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('NewsLetter.message'), NewsLetterMenu(ctx));
		return;
	}

	@Hears('Чат')
	async onChat(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(CHAT_SCENE_ID);
		return;
	}

	@Hears('Описание')
	async onDescription(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(DESCRIPTION_SCENE_ID);
		return;
	}

	@Hears('Купить')
	async onBuy(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(BUY_SCENE_ID);
		return;
	}

	@On('text')
	async onDownloadBack(@Ctx() ctx: IContext) {
		await ctx.reply(ctx.i18.t('Text.menu'), Menu(ctx));
		return;
	}

}
