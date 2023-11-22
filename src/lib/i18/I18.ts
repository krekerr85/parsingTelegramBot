import * as fs from 'fs';
import { I18nSettings } from './types';
import { IContext } from '../../interfaces/context.interface';

class I18 {
	private currentLocale: string;
	readonly settings: I18nSettings;
	public locales: string[];

	constructor(settings: I18nSettings) {
		this.settings = settings;
	}

	private loadLocales = (): void => {
		const { pathToLocales } = this.settings;
		const locales = fs.readdirSync(pathToLocales);
		this.locales = locales.map(locale => locale.split('.')[0]);
	};

	public middleware = () => {
		return async (ctx: IContext, next: () => Promise<void>) => {
			this.loadLocales();
			const { defaultLocale } = this.settings;
			ctx.session.languageCode = this.currentLocale || defaultLocale;
			this.currentLocale = ctx.session.languageCode;
			ctx.i18 = {
				t: this.t,
				setLocale: this.setLocale(ctx)
			};
			await next();
		};
	};

	public t = (key: string, params?: Record<string, string>): string => {
		const { pathToLocales } = this.settings;
		const locale = this.currentLocale;
		const file = fs.readFileSync(`${pathToLocales}/${locale}.json`, 'utf-8');
		const json = JSON.parse(file);
		const keys = key.split('.');
		const value = keys.reduce((prev, current) => prev[current], json);
		if (!value) {
			return key;
		}
		if (!params) {
			return value;
		}
		return Object.keys(params).reduce(
			(prev, current) => prev.replace(`{{${current}}}`, params[current]),
			value
		);
	};

	public setLocale =
		(ctx: IContext) =>
		(locale: string): void => {
			ctx.session.languageCode = locale;
			this.currentLocale = ctx.session.languageCode;
		};

	static match = (key: string) => {
		return (ctx: IContext) => {
			return ctx.i18.t(key);
		};
	};
}

I18.match = (key: string) => {
	return (ctx: IContext) => {
		return ctx.i18.t(key);
	};
};

// export const match = (key: string) => {
// 	return (ctx: IContext) => {
// 		return ctx.i18.t(key);
// 	};
// };

export default I18;
