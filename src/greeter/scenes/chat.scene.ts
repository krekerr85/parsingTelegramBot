import { Scene, SceneEnter, Ctx } from 'nestjs-telegraf';
import { CHAT_SCENE_ID } from '../../app.constants';
import { IContext } from '../../interfaces/context.interface';
import { Menu } from 'src/Markup/Menu';
import { ChatButton } from 'src/Markup/Payment';

@Scene(CHAT_SCENE_ID)
export class ChatScene {
	constructor() {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Chat.message'), ChatButton(ctx));
	}
}
