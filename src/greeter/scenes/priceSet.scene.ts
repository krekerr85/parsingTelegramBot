import {
	Scene,
	SceneEnter,
	SceneLeave,
	Ctx,
	Hears,
	Message,
	On
} from 'nestjs-telegraf';
import { PRICE_SET_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Menu } from 'src/Markup/Menu';
import { Back } from '../../Markup/Back';
import { ParamsService } from '../services/params.service';

@Scene(PRICE_SET_SCENE_ID)
export class PriceSetScene {
	constructor(private readonly paramsService: ParamsService) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Price.set'), Back(ctx));
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.menu'), Menu(ctx));
	}

	// @ts-ignore
	@Hears((value, ctx: IContext) => {
		return value === ctx.i18.t('Back.message');
	})
	async onLeaveHears(@Ctx() ctx: ScenesContext): Promise<void> {
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
		try {
			const amount = parseFloat(message.replace(',', '.'));
			await this.paramsService.updateParams({ programmPrice: amount });
			await ctx.reply(`Новая цена ${amount} USD установлена!`);
			await ctx.scene.leave();
		} catch (e) {
			console.log(e);
			await ctx.reply(ctx2.i18.t('Price.error'), Back(ctx2));
		}
	}
}
