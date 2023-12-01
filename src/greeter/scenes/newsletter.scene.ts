import {
	Scene,
	SceneEnter,
	SceneLeave,
	Ctx,
	Hears,
	On,
	Message,
	Action
} from 'nestjs-telegraf';
import { NEWSLETTER_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Back } from '../../Markup/Back';
import { AdminMenu } from '../../Markup/AdminMenu';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/User.model';
import { Markup } from 'telegraf';
import { markdownV2Format } from 'src/utils/format';

@Scene(NEWSLETTER_SCENE_ID)
export class NewsletterScene {
	constructor(@InjectModel('user') private userModel: Model<User>) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('NewsLetter.message'), Back(ctx));
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.message'), AdminMenu(ctx));
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

	@On('text')
	async onNewsletter(
		@Ctx() ctx: ScenesContext,
		@Ctx() ctx2: IContext,
		@Message('text') message: string
	) {
		ctx.session.__scenes.state.message = message;
		await ctx.reply(
			`${ctx2.i18.t('NewsLetter.yourMessage')} \\- '${markdownV2Format(
				message
			)}'\n⚠️ ${ctx2.i18.t('NewsLetter.wantToSend')} ⚠️`,
			{
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: ctx2.i18.t('NewsLetter.messageSend'),
								callback_data: 'send'
							},
							{
								text: ctx2.i18.t('NewsLetter.messageCancel'),
								callback_data: 'cancel'
							}
						]
					]
				},
				parse_mode: 'MarkdownV2'
			}
		);
	}

	@Action('send')
	async onSend(@Ctx() ctx: ScenesContext, @Ctx() ctx2: IContext): Promise<void> {
		const users = await this.userModel.find();
		try {
			await Promise.all(
				users.map(async (user, index) => {
					if (index % 25 === 0) {
						await new Promise(resolve => setTimeout(resolve, 1000));
					}
					await ctx.telegram.sendMessage(
						user.tgId,
						ctx.session.__scenes.state.message
					);
				})
			);
		} catch (err) {
			console.log(err);
		}
		await ctx.answerCbQuery(ctx2.i18.t('NewsLetter.sended'));
		await ctx.deleteMessage();
		await ctx.reply(
			ctx2.i18.t('NewsLetter.message'),
			Markup.keyboard([Markup.button.callback('⬅\uFE0F Назад', 'cancel')], {
				columns: 2,
				wrap: (btn, index, currentRow) => index % 2 !== 0
			}).resize()
		);
	}

	@Action('cancel')
	async onCancel(@Ctx() ctx: IContext): Promise<void> {
		await ctx.answerCbQuery(ctx.i18.t('NewsLetter.canceled'));
		await ctx.deleteMessage();
		await ctx.reply(ctx.i18.t('NewsLetter.message'), Back(ctx));
	}
}
