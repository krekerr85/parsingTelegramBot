import { Module } from '@nestjs/common';
import { PaymentsSchema } from 'src/walletpay/models/Payments.model';
import { WalletPayService } from './services/walletpay.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { WalletPayWebhookController } from './controller/webhook.controller';
import { DonatesSchema } from './models/Donate.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'payments',
				schema: PaymentsSchema
			},
			{
				name: 'donates',
				schema: DonatesSchema
			}
		]),
		UserModule
	],
	providers: [WalletPayService],
	exports: [WalletPayService],
	controllers: [WalletPayWebhookController]
})
export class WalletPayModule {}
//
