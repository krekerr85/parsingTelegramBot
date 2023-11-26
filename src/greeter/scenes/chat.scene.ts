import {
	Scene,
	SceneEnter,
	SceneLeave,
	Ctx,
	Hears,
	On,
	Message
} from 'nestjs-telegraf';
import { AUDIO_SCENE_ID, CHAT_SCENE_ID } from '../../app.constants';
import { IContext, ScenesContext } from '../../interfaces/context.interface';
import { Back } from '../../Markup/Back';
import { ClassDownloader } from '../../utils/YouTubeDownloader.class';
import { v4 as uuidv4 } from 'uuid';
import { VideoMenu } from '../../Markup/VideoMenu';
import { AnalyticsService } from '../services/analytic.service';
import { Menu } from 'src/Markup/Menu';

@Scene(CHAT_SCENE_ID)
export class ChatScene {
	private downloaderService: ClassDownloader = new ClassDownloader();

	constructor(private analyticsService: AnalyticsService) {}

	@SceneEnter()
	async onSceneEnter(@Ctx() ctx: IContext): Promise<void> {
		await ctx.reply(ctx.i18.t('Chat.message'), Menu(ctx));
	}

	
}
