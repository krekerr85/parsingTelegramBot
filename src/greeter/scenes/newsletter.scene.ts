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
		await ctx.reply('Отправте сообщение для рассылки', Back(ctx));
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
		@Message('text') message: string
	) {
		ctx.session.__scenes.state.message = message;
		await ctx.reply(
			`Ваше сообщение \\- '${markdownV2Format(
				message
			)}'\n⚠️ Вы действительно хотите его отправить? ⚠️`,
			{
				reply_markup: {
					inline_keyboard: [
						[
							{
								text: 'Отправить',
								callback_data: 'send'
							},
							{
								text: 'Отмена',
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
	async onSend(@Ctx() ctx: ScenesContext): Promise<void> {
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
		await ctx.answerCbQuery('Отправлено');
		await ctx.deleteMessage();
		await ctx.reply(
			'Отправте сообщение для рассылки',
			Markup.keyboard([Markup.button.callback('⬅\uFE0F Назад', 'cancel')], {
				columns: 2,
				wrap: (btn, index, currentRow) => index % 2 !== 0
			}).resize()
		);
	}

	@Action('cancel')
	async onCancel(@Ctx() ctx: IContext): Promise<void> {
		await ctx.answerCbQuery('Отменено');
		await ctx.deleteMessage();
		await ctx.reply('Отправте сообщение для рассылки', Back(ctx));
	}
}
