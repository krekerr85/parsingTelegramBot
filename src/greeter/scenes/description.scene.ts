import { Scene, SceneEnter, Ctx } from 'nestjs-telegraf';
import { DESCRIPTION_SCENE_ID } from '../../app.constants';
import { IContext } from '../../interfaces/context.interface';
import { NewsLetterMenu } from 'src/Markup/NewsLetterMenu';

@Scene(DESCRIPTION_SCENE_ID)
export class DescriptionScene {
	private message = `
	Программное обеспечение  рассылки для Windows.
	Рассылка в Чаты Telegram. Навсегда. Без Подписки.
	• Упоминание @ Участников. Гарантия, что Реклама будет Прочитана.
	• Работа с Компьютера Windows 10+
	• Отправка Фото + Текст + Эмодзи.
	• Поддержка Форматирования Текста.
	• Синонимизация Текста позволяет избежать Флуда/Спама
	• Индивидуальная Группировка. Аккаунты телеграмм можно Разделить на Группы.
	• Выбор сколько людей будет упоминаться в сообщении от 0 до 50.
	• Выбор Аккаунтов, кого Необходимо Упоминать.
	• Поддержка JSON.
	• Мультипоточность. Поддерживает Подключение.
	• Массы Аккаунтов в Одном Окне.
	• Возможность Настраивать Telegram Аккаунт.
	• Бесплатные Обновления.
	Техническая поддержка @depseller.`;
	constructor() {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(this.message, NewsLetterMenu(ctx));
	}
}
