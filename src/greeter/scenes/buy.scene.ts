import { Scene, SceneEnter, SceneLeave, Ctx, Hears } from 'nestjs-telegraf';
import { BUY_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';

import { DownLoadMenu } from 'src/Markup/DownLoadMenu';
import { WalletPayService } from '../../walletpay/services/walletpay.service';
import { Markup } from 'telegraf';

@Scene(BUY_SCENE_ID)
export class BuyScene {
	constructor(private walletPayService: WalletPayService) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		const userId = ctx.from?.id;
		if (userId) {
			const order = await this.walletPayService.createOrder(userId);
			if (!order) {
				ctx.reply('Вы уже приобрели программу!');
				return;
			}

			if (order.paymentLink) {
				const keyboard = Markup.inlineKeyboard([
					Markup.button.url(`👛 Wallet Pay`, order.paymentLink)
				]);

				ctx.reply(
					`Стоимость ${order.tonCost} TON. \nНажмите на кнопку чтобы оплатить:`,
					keyboard
				);
			} else {
				console.log('buttonUrl not defined');
				ctx.reply('Ошибка при создании заказа.');
			}
		} else {
			console.log('userId not defined');
			ctx.reply('Ошибка при создании заказа.');
		}
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.download'), DownLoadMenu(ctx));
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

	@Hears('/restart')
	async onRestart(@Ctx() ctx: ScenesContext): Promise<void> {
		await ctx.scene.leave();
	}
}
