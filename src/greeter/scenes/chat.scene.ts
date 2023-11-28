import { Scene, SceneEnter, SceneLeave, Ctx, Hears} from 'nestjs-telegraf';
import { CHAT_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Menu } from 'src/Markup/Menu';
import { ChatButton } from 'src/Markup/Payment';
import { WalletPayService } from 'src/walletpay/services/walletpay.service';

@Scene(CHAT_SCENE_ID)
export class ChatScene {
	constructor(private walletPayService: WalletPayService) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext, @Ctx() ctx2: ScenesContext): Promise<void> {
		const userId = ctx.from?.id;
		if (!userId){
			await ctx2.scene.leave();
		}
		const isDonated = await this.walletPayService.checkPayment(userId);
		if (isDonated) {
			await ctx.reply(ctx.i18.t('Chat.message'), ChatButton(ctx));
		}else{
			await ctx.reply(ctx.i18.t('Chat.needDonate'));
		}
		
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
}
