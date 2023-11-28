import { Scene, SceneEnter, SceneLeave, Ctx, Hears } from 'nestjs-telegraf';
import { BUY_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { WalletPayService } from '../../walletpay/services/walletpay.service';
import { Menu } from 'src/Markup/Menu';
import { ParamsService } from '../services/params.service';
@Scene(BUY_SCENE_ID)
export class BuyScene {
	constructor(
		private walletPayService: WalletPayService,
		private readonly paramsService: ParamsService
	) {}

	@SceneEnter()
	async onSceneEnter(
		@Ctx() ctx: IContext,
		@Ctx() ctx2: ScenesContext
	): Promise<void> {
		const userId = ctx.from?.id;
		if (userId) {
			const { programmPrice } = await this.paramsService.getParams();
			const order = await this.walletPayService.createOrder(
				userId,
				programmPrice
			);
			if (!order) {
				await ctx.reply('Ошибка при создании заказа.');
				await ctx2.scene.leave();
				return;
			}
			if (order.status === 'success') {
				await ctx.reply('Вы уже приобрели программу!');
				await ctx2.scene.leave();
				return;
			}

			if (order.paymentLink) {
				await ctx2.scene.leave();
			} else {
				console.log('buttonUrl not defined');
				await ctx.reply('Ошибка при создании заказа.');
				await ctx2.scene.leave();
			}
		} else {
			console.log('userId not defined');
			await ctx.reply('Ошибка при создании заказа.');
			await ctx2.scene.leave();
		}
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.menu'), Menu(ctx));
	}

	@Hears('/restart')
	async onRestart(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.leave();
	}
}
