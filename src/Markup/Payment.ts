
import { Markup } from 'telegraf';
import { IContext } from '../interfaces/context.interface';

export const ChatButton = (ctx: IContext) => {

    return Markup.inlineKeyboard([
        Markup.button.url('@TWITRIS', process.env.TELEGRAM_URL)
      ])
};
