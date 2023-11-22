import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChannelsSearch extends Document {
	@Prop({ required: true, type: String })
	query: string;

    @Prop({ required: true, type: Array })
	channels: string[];
}

export const ChannelsSchema =
	SchemaFactory.createForClass(ChannelsSearch);

