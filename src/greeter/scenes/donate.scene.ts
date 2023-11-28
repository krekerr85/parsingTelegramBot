import { Scene, SceneEnter, SceneLeave, Ctx, Hears, Message, On } from 'nestjs-telegraf';
import { BUY_SCENE_ID, DONATE_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { WalletPayService } from '../../walletpay/services/walletpay.service';
import { Markup } from 'telegraf';
import { Menu } from 'src/Markup/Menu';
import { Back } from '../../Markup/Back';
@Scene(DONATE_SCENE_ID)
export class DonateScene {
	constructor(private walletPayService: WalletPayService) {}

	@SceneEnter()
	async onSceneEnter(
		@Ctx() ctx: IContext,
		@Ctx() ctx2: ScenesContext
	): Promise<void> {
		await ctx.reply(ctx.i18.t('Donate.restrictions'), Back(ctx));
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.menu'), Menu(ctx));
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
		
		try{
			const amount = Number(message);
			const userId = ctx.from?.id;
		if (userId) {
			const order = await this.walletPayService.createDonateOrder(userId, amount);
			if (!order) {
				await ctx.reply('Ошибка при создание ссылки на оплату.');
				await ctx.scene.leave();
				return;
			}

			if (order.paymentLink) {
				await ctx.scene.leave();
			} else {
				console.log('buttonUrl not defined');
				await ctx.reply('Ошибка при создании заказа.');
				await ctx.scene.leave();
			}
		} else {
			console.log('userId not defined');
			await ctx.reply('Ошибка при создании заказа.');
			await ctx.scene.leave();
		}

		}catch(e){
			await ctx.reply('Ошибка при создании заказа.');
			await ctx.scene.leave();
		}

	}
}
