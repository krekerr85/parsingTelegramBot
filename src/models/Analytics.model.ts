import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Analytics extends Document {
	@Prop({ required: true })
	userName: string;

	@Prop({ required: true })
	type: string;

	@Prop({ required: true })
	link: string;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
