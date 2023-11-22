import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChannelMessage extends Document {
	@Prop({ required: true, type: String })
	message: string;

	@Prop({ required: true, type: Number })
	index: number;
}

export const ChannelMessageSchema =
	SchemaFactory.createForClass(ChannelMessage);
