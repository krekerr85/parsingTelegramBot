import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { IContext } from '../../interfaces/context.interface';
import { UserService } from '../services/user.service';

@Injectable()
export class SubsGuard implements CanActivate {
	//constructor(private userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = TelegrafExecutionContext.create(context);
		const { from } = ctx.getContext<IContext>();

		//const isAdmin = await this.userService.isAdmin(from.id);

		// if (!isAdmin) {
		//   throw new TelegrafException('You are not admin 😡');
		// }

		return true;
	}
}
