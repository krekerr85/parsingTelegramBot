import { Markup } from 'telegraf';

export const ChooseLang = (): Markup.Markup<any> => {
	return Markup.inlineKeyboard([
		Markup.button.callback('Русский 🇷🇺', 'ru'),
		Markup.button.callback('English 🇺🇸', 'en')
	]);
};
