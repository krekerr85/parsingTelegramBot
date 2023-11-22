import { IContext } from '../interfaces/context.interface';
import { Markup } from 'telegraf';

export const ChannelMenu = (ctx: IContext): Markup.Markup<any> => {
	return Markup.keyboard(
		[
			Markup.button.callback(ctx.i18.t('Back.message'), 'cancel'),
			Markup.button.callback('Текущая проверка', 'cancel'),
			Markup.button.callback('Добавить проверку', 'cancel')
		],
		{
			columns: 2,
			wrap: (btn, index, currentRow) => index % 2 !== 0
		}
	).resize();
};
