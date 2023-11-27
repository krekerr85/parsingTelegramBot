import { Scene, SceneEnter, SceneLeave, Ctx, Hears } from 'nestjs-telegraf';
import { BUY_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { WalletPayService } from '../../walletpay/services/walletpay.service';
import { Markup } from 'telegraf';
import { Menu } from 'src/Markup/Menu';
@Scene(BUY_SCENE_ID)
export class BuyScene {
	constructor(private walletPayService: WalletPayService) {}

	@SceneEnter()
	async onSceneEnter(
		@Ctx() ctx: IContext,
		@Ctx() ctx2: ScenesContext
	): Promise<void> {
		const userId = ctx.from?.id;
		if (userId) {
			const order = await this.walletPayService.createOrder(userId, 0.01);
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
				const keyboard = Markup.inlineKeyboard([
					Markup.button.url(`👛 Wallet Pay`, order.paymentLink)
				]);
				await ctx.reply(
					`Для оплаты нажмите на кнопку.\nСтоимость ${order.tonCost} TON.`,
					keyboard
				);
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
