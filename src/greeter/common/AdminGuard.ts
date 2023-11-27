import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';
import { IContext } from '../../interfaces/context.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = TelegrafExecutionContext.create(context);
		const { from } = ctx.getContext<IContext>();
		console.log(from.id);
		const isAdmin = await this.userService.isAdmin(from.id);

		if (!isAdmin) {
			throw new TelegrafException('Вы не админ 😡');
		}

		return true;
	}
}
