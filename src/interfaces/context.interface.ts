import { Scenes, Context } from 'telegraf';
export interface IContext extends Context {
	session: {
		languageCode: string;
		isAdmin: boolean;
		subscription: boolean;
	};
	i18: {
		t: (key: string, params?: Record<string, string>) => string;
		setLocale: (locale: string) => void;
	};
}

interface IScenesContext extends Scenes.SceneSessionData {
	state: {
		isLoading: boolean;
		message?: string;
	};
}

export type ScenesContext = Scenes.SceneContext<IScenesContext>;
