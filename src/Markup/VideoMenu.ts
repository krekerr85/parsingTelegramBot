import { Markup } from 'telegraf';
import { IContext } from '../interfaces/context.interface';

export const VideoMenu = (ctx: IContext): Markup.Markup<any> => {
	return Markup.keyboard(
		[
			// Markup.button.callback(ctx.i18.t('Shorts.message'), 'downloadShorts'),
			// Markup.button.callback(ctx.i18.t('Long.message'), 'downloadLongVideo'),
			// Markup.button.callback(ctx.i18.t('Audio.message'), 'downloadAudio'),
			
			Markup.button.callback(ctx.i18.t('Скачать'), 'tikTok'),
			Markup.button.callback(ctx.i18.t('Конвертер'), 'tikTok'),
			Markup.button.callback(ctx.i18.t('Back.message'), 'cancel'),
		],
		{
			columns: 2,
			wrap: (btn, index, currentRow) => index % 2 !== 0
		}
	).resize();
};
