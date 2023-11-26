import {
	Scene,
	SceneEnter,
	SceneLeave,
	Ctx,
	Hears,
	Action
} from 'nestjs-telegraf';
import { ANALYTICS_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Back } from '../../Markup/Back';
import { AdminMenu } from '../../Markup/AdminMenu';
import { AnalyticsService } from '../services/analytic.service';

@Scene(ANALYTICS_SCENE_ID)
export class AnalyticsScene {
	constructor(private analyticsService: AnalyticsService) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		const analytics = await this.analyticsService.getFullAnalytics();
		await ctx.reply('Статистика:', Back(ctx));

		await ctx.reply(analytics, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: 'Обновить',
							callback_data: 'update'
						}
					]
				]
			},
			parse_mode: 'MarkdownV2'
		});

		return;
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

	@Action('update')
	async onUpdate(@Ctx() ctx: ScenesContext): Promise<void> {
		const analytics = await this.analyticsService.getFullAnalytics();

		await ctx.editMessageText(analytics);

		await ctx.editMessageReplyMarkup({
			inline_keyboard: [
				[
					{
						text: 'Обновить',
						callback_data: 'update'
					}
				]
			]
		});

		await ctx.answerCbQuery();
		return;
	}
}
