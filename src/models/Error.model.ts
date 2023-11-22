import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Error extends Document {
	@Prop({ required: true })
	type: string;
}

export const ErrorSchema = SchemaFactory.createForClass(Error);
