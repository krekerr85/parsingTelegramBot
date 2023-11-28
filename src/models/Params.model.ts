import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Params extends Document {

	@Prop({ required: true, default: false })
	subscription: boolean;

	@Prop({ required: true, default: 70 })
	programmPrice: number;

}

export const ParamsSchema = SchemaFactory.createForClass(Params);
