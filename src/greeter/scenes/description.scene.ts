import {
	Scene,
	SceneEnter,
	SceneLeave,
	Ctx,
	Hears,
	On,
	Message
} from 'nestjs-telegraf';
import { DESCRIPTION_SCENE_ID, LONGS_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Back } from '../../Markup/Back';
import { ClassDownloader } from '../../utils/YouTubeDownloader.class';
import { v4 as uuidv4 } from 'uuid';
import { VideoMenu } from '../../Markup/VideoMenu';
import { AnalyticsService } from '../services/analytic.service';
import { DownLoadMenu } from 'src/Markup/DownLoadMenu';
import { ParsingMenu } from 'src/Markup/ParsingMenu';
import { NewsLetterMenu } from 'src/Markup/NewsLetterMenu';

@Scene(DESCRIPTION_SCENE_ID)
export class DescriptionScene {
	private downloaderService: ClassDownloader = new ClassDownloader();
	private message = `🤯 @TWITRIS_BOT

	🔥 Рассылка в Чаты Telegram.
	
	🔄 Навсегда. Без Подписки.
	
	✔️ Упоминание @ Участников. Гарантия, что Реклама будет Прочитана.
	
	🆕 Работа с Компьютера Windows 10+
	
	👍 Отправка Фото + Текст + Эмодзи.
	
	🖥 Поддержка Форматирования Текста.
	
	📊 Синонимизация Текста позволяет избежать Флуда/Спама
	
	👀 Индивидуальная Группировка. Аккаунты телеграмм можно Разделить на Группы.
	
	‼️ Выбор сколько людей будет упоминаться в сообщении от 0 до 50.
	
	🔼 Выбор Аккаунтов, кого Необходимо Упоминать.
	
	🌐 Поддержка JSON.
	
	🕯 Мультипоточность. Поддерживает Подключение Массы Аккаунтов в Одном Окне.
	
	🔗 Возможность Настраивать Telegram Аккаунт.
	
	⚡️ Аналогов Не Существует.
	
	🤯 ☝️ ✋🖖☝️ 🤞🖖✌️
	
	🆕 @TWITRIS_BOT`;
	constructor(private analyticsService: AnalyticsService) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(this.message, NewsLetterMenu(ctx));
	}

	
}
