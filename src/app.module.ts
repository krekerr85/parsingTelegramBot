import { Module } from '@nestjs/common';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GreeterModule } from './greeter/greeter.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { skipMiddleware } from './middleware/skip.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import * as LocalSession from 'telegraf-session-local';
import { I18 } from './lib/i18';
import { path } from 'app-root-path';

const i18n = new I18({
	defaultLocale: 'ru',
	pathToLocales: `${path}/locales`
});

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env'
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				uri: configService.get<string>('MONGO_URL')
			}),
			inject: [ConfigService]
		}),
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const opt: TelegrafModuleOptions = {
					token: configService.get<string>('TELEGRAM_TOKEN'),
					middlewares: [
						skipMiddleware,
						new LocalSession({ database: 'session.json' }).middleware(),
						i18n.middleware()
					],
					launchOptions: {
						// webhook: {
						// 	domain: configService.get<string>('TELEGRAM_WEBHOOK_DOMAIN'),
						// 	port: configService.get<number>('TELEGRAM_WEBHOOK_PORT'),
						// 	hookPath: configService.get<string>('TELEGRAM_WEBHOOK_PATH')
						// }
					},
					include: [GreeterModule, ServeStaticModule]
				};

				return opt;
			},
			inject: [ConfigService]
		}),
		GreeterModule
	]
})
export class AppModule {}
