import { Markup } from 'telegraf';
import { IContext } from '../interfaces/context.interface';

export const NewsLetterMenu = (ctx: IContext): Markup.Markup<any> => {
	return Markup.keyboard(
		[	
			Markup.button.callback(ctx.i18.t('Описание'), 'description'),
			Markup.button.callback(ctx.i18.t('Купить'), 'buy'),
			Markup.button.callback(ctx.i18.t('Back.message'), 'cancel'),
		],
		{
			columns: 2,
			wrap: (btn, index, currentRow) => index % 2 !== 0
		}
	).resize();
};
