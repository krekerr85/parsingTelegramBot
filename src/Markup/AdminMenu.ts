import { Markup } from 'telegraf';
import { IContext } from '../interfaces/context.interface';

export const AdminMenu = (ctx: IContext): Markup.Markup<any> => {
	const subscription = ctx.session.subscription;
	return Markup.keyboard(
		[
			Markup.button.callback('Аналитика 👾', 'analytics'),
			Markup.button.callback('Сделать рассылку 👥', 'users'),
			Markup.button.callback('Проверка на подписку 📄', 'channels'),
			subscription ? Markup.button.callback('Деактивация подписки 📄', 'subscription') : Markup.button.callback('Активация подписки 📄', 'subscription'),
			Markup.button.callback(ctx.i18.t('Back.message'), 'cancel')
		],
		{
			columns: 2,
			wrap: (btn, index, currentRow) => index % 2 !== 0
		}
	).resize();
};
