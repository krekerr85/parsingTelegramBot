import { Module } from '@nestjs/common';
import { UserSchema } from 'src/models/User.model';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from 'src/models/Admin.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'user',
				schema: UserSchema
			},
			{
				name: 'admin',
				schema: AdminSchema
			}
		])
	],
	providers: [UserService],

	exports: [UserService]
})
export class UserModule {}
