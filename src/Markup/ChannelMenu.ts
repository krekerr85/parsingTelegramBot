import { IContext } from '../interfaces/context.interface';
import { Markup } from 'telegraf';

export const ChannelMenu = (ctx: IContext): Markup.Markup<any> => {
	return Markup.keyboard(
		[
			Markup.button.callback(ctx.i18.t('Back.message'), 'cancel'),
			Markup.button.callback(ctx.i18.t('ChannelMenu.currentCheck'), 'cancel'),
			Markup.button.callback(ctx.i18.t('ChannelMenu.addCheck'), 'cancel')
		],
		{
			columns: 2,
			wrap: (btn, index, currentRow) => index % 2 !== 0
		}
	).resize();
};
