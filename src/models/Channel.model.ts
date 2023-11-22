import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChannelSubscriptions extends Document {
	@Prop({ required: true, type: String })
	chatId: string;
}

export const ChannelSubscriptionsSchema =
	SchemaFactory.createForClass(ChannelSubscriptions);
