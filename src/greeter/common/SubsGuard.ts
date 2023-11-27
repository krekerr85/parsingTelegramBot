import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { IContext } from '../../interfaces/context.interface';
import { UserService } from 'src/user/user.service';
import { ParamsService } from '../services/params.service';

@Injectable()
export class SubsGuard implements CanActivate {
	constructor(
		private userService: UserService,
		private paramsService: ParamsService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { subscription } = await this.paramsService.getParams();
		if (subscription) {
			const ctx = TelegrafExecutionContext.create(context);
			const { from } = ctx.getContext<IContext>();

			const isSubscribed = await this.userService.isSub(from.id);

			if (!isSubscribed) {
				throw new TelegrafException(
					'Вам необходимо подписаться на канал @expert_tm'
				);
			}

			return true;
		} else {
			return true;
		}
	}
}
