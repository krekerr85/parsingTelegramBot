import { Module } from '@nestjs/common';
import { PaymentsSchema } from 'src/walletpay/models/Payments.model';
import { WalletPayService } from './services/walletpay.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { WalletPayWebhookController } from './controller/webhook.controller';
//import { Telegraf } from 'telegraf';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'payments',
				schema: PaymentsSchema
			}
		]),
		UserModule
	],
	providers: [
		WalletPayService
	],
	exports: [
		WalletPayService
	],
	controllers: [
		WalletPayWebhookController
	],
})
export class WalletPayModule {}
//
