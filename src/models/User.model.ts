import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
	@Prop({ required: true })
	tgId: number;

	@Prop({ required: true })
	username: string;

	@Prop({ type: Date, default: Date.now })
	lastActivity: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
