import { Markup } from 'telegraf';
import { IContext } from '../interfaces/context.interface';

export const AdminMenu = (ctx: IContext): Markup.Markup<any> => {
	const subscription = ctx.session.subscription;
	return Markup.keyboard(
		[
			Markup.button.callback(ctx.i18.t('AdminMenu.analytics'), 'analytics'),
			Markup.button.callback(ctx.i18.t('AdminMenu.newsLetter'), 'users'),
			Markup.button.callback(ctx.i18.t('AdminMenu.checkSubs'), 'channels'),
			Markup.button.callback(ctx.i18.t('AdminMenu.setPrice'), 'programmPrice'),
			subscription ? Markup.button.callback(ctx.i18.t('AdminMenu.deactivateSub'), 'subscription') : Markup.button.callback(ctx.i18.t('AdminMenu.activateSub'), 'subscription'),
			Markup.button.callback(ctx.i18.t('Back.message'), 'cancel')
		],
		{
			columns: 2,
			wrap: (btn, index, currentRow) => index % 2 !== 0
		}
	).resize();
};
