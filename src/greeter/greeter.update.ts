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
	DONATE_SCENE_ID,
	EXAMINATION_SCENE_ID,
	LONGS_SCENE_ID,
	NEWSLETTER_SCENE_ID,
	PRICE_SET_SCENE_ID,
	SHORTS_SCENE_ID,
	SUBS_ACTIVATE_SCENE_ID,
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
import { NewsLetterMenu } from 'src/Markup/NewsLetterMenu';
import { UserService } from 'src/user/user.service';
import { SubsGuard } from './common/SubsGuard';

@Update()
@UseFilters(TelegrafExceptionFilter)
export class GreeterUpdate {
	constructor(private userService: UserService) {}

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
		console.log('session:', ctx?.session);
		console.log('update:', ctx?.update);
		await next();
	}

	@UseGuards(SubsGuard)
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

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('ChooseLang.message');
	})
	async onHello(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('ChooseLang.chooseMessage'), ChooseLang());
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Long.message');
	})
	async hearsLongs(@Ctx() ctx: ScenesContext) {
		await ctx.scene.enter(LONGS_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Shorts.message');
	})
	async hearsShorts(@Ctx() ctx: ScenesContext) {
		await ctx.scene.enter(SHORTS_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Audio.message');
	})
	async hearsAudio(@Ctx() ctx: ScenesContext) {
		await ctx.scene.enter(AUDIO_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('VideoNote.message');
	})
	async hearsVideoNote(@Ctx() ctx: ScenesContext) {
		await ctx.scene.enter(VIDEO_NOTE_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	@Hears('TikTok')
	async onTikTok(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(TIKTOK_SCENE_ID);
		return;
	}

	@UseGuards(AdminGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('AdminMenu.analytics');
	})
	async onAnalytics(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(ANALYTICS_SCENE_ID);
		return;
	}

	@UseGuards(AdminGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('AdminMenu.checkSubs');
	})
	async onChannel(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.message'), ChannelMenu(ctx));
		return;
	}

	@UseGuards(AdminGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return (
			value === ctx.i18.t('AdminMenu.activateSub') ||
			value === ctx.i18.t('AdminMenu.deactivateSub')
		);
	})
	async onSubscription(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(SUBS_ACTIVATE_SCENE_ID);
		return;
	}

	@UseGuards(AdminGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('AdminMenu.newsLetter');
	})
	async onNewsletter(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(NEWSLETTER_SCENE_ID);
		return;
	}

	@UseGuards(AdminGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('AdminMenu.setPrice');
	})
	async onPriceSet(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(PRICE_SET_SCENE_ID);
		return;
	}

	@UseGuards(AdminGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Menu.admin');
	})
	async onAdmin(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.message'), AdminMenu(ctx));
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Menu.video');
	})
	async onVideo(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.video'), VideoMenu(ctx));
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Menu.chat');
	})
	async onChat(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(CHAT_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Menu.donate');
	})
	async onDonate(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(DONATE_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('VideoMenu.download');
	})
	async onDownLoad(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.download'), DownLoadMenu(ctx));
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('VideoMenu.conveter');
	})
	async onConvert(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Convert.message'), ConverterMenu(ctx));
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('ParsingMenu.channels');
	})
	async onСhannels(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(CHANNELS_SEARCH_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Menu.parsing');
	})
	async onParse(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Parsing.message'), ParsingMenu(ctx));
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('ParsingMenu.subs');
	})
	async onUsers(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(CHANNEL_USER_SEARCH_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('ParsingMenu.newsLetter');
	})
	async onNewsLetter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('NewsLetter.message'), NewsLetterMenu(ctx));
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('NewsLetterMenu.description');
	})
	async onDescription(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(DESCRIPTION_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('NewsLetterMenu.buy');
	})
	async onBuy(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(BUY_SCENE_ID);
		return;
	}

	@UseGuards(AdminGuard)
	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('ChannelMenu.addCheck');
	})
	async onExamination(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.enter(EXAMINATION_SCENE_ID);
		return;
	}

	@UseGuards(SubsGuard)
	@On('text')
	async onDownloadBack(@Ctx() ctx: IContext) {
		await ctx.reply(ctx.i18.t('Text.menu'), Menu(ctx));
		return;
	}
}
