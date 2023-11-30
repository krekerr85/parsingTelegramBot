import { Markup } from 'telegraf';
import { IContext } from '../interfaces/context.interface';

export const Menu = (ctx: IContext): Markup.Markup<any> => {
	const isAdmin = ctx.session.isAdmin;

	return Markup.keyboard(
		[
			//Markup.button.callback(ctx.i18.t('Видео'), 'tikTok'),
			Markup.button.callback(ctx.i18.t('Menu.parsing'), 'parsing'),
			//Markup.button.callback(ctx.i18.t('Донат'), 'donate'),
			Markup.button.callback(ctx.i18.t('ChooseLang.message'), 'chooseLang'),
			Markup.button.callback(ctx.i18.t('Menu.chat'), 'chat'),
			
			(isAdmin && Markup.button.callback(ctx.i18.t('Menu.admin'), 'admin')) || ''
		],
		{
			columns: 2,
			//wrap: (btn, index, currentRow) => index % 2 !== 0
		}
	).resize();
};
