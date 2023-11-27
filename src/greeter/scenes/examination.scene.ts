import { SceneLeave, Ctx, Wizard, WizardStep } from 'nestjs-telegraf';
import { EXAMINATION_SCENE_ID } from '../../app.constants';
import { IContext } from '../../interfaces/context.interface';
import { AdminMenu } from '../../Markup/AdminMenu';
import { WizardContext } from 'telegraf/typings/scenes';
import { Back } from '../../Markup/Back';

@Wizard(EXAMINATION_SCENE_ID)
export class ExaminationWizardScene {
	constructor() {}

	@WizardStep(1)
	async onSceneEnter(
		@Ctx() ctx: WizardContext,
		@Ctx() ctx2: IContext
	): Promise<void> {
		ctx.wizard.next();
		await ctx.reply(
			`Введите название канала\nНапример: @channel_name или https://t.me/channel_name\n\n⚠️ Внимание, после добавления канала, добавьте этого бота в качестве администратора в выбранный вами канал ⚠️`,
			Back(ctx2)
		);
		return;
	}

	@SceneLeave()
	async onSceneLeave(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Text.message'), AdminMenu(ctx));
	}
}
