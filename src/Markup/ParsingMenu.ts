import { Markup } from 'telegraf';
import { IContext } from '../interfaces/context.interface';

export const ParsingMenu = (ctx: IContext): Markup.Markup<any> => {
	return Markup.keyboard(
		[
			Markup.button.callback(ctx.i18.t('ParsingMenu.subs'), 'users'),
			Markup.button.callback(ctx.i18.t('ParsingMenu.channels'), 'channels'),
			Markup.button.callback(ctx.i18.t('ParsingMenu.newsLetter'), 'newsletter'),
			Markup.button.callback(ctx.i18.t('Back.message'), 'cancel'),
		],
		{
			columns: 2,
			wrap: (btn, index, currentRow) => index % 2 !== 0
		}
	).resize();
};
