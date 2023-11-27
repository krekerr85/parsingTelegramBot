import { Scene, SceneEnter, Ctx } from 'nestjs-telegraf';
import { SUBS_ACTIVATE_SCENE_ID } from '../../app.constants';
import { IContext } from '../../interfaces/context.interface';
import { ParamsService } from '../services/params.service';
import { AdminMenu } from 'src/Markup/AdminMenu';

@Scene(SUBS_ACTIVATE_SCENE_ID)
export class SubsActivateScene {
	constructor(private paramsService: ParamsService) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		const params = await this.paramsService.getParams();

		if (params.subscription === true) {
			await this.paramsService.updateParams({ subscription: false });
			ctx.session.subscription = false;
			await ctx.reply(ctx.i18.t('Subscription.deactivate'), AdminMenu(ctx));
		} else {
			await this.paramsService.updateParams({ subscription: true });
			ctx.session.subscription = true;
			await ctx.reply(ctx.i18.t('Subscription.activate'), AdminMenu(ctx));
		}
	}
}
