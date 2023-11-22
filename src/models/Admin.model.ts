import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Admin extends Document {
	@Prop({ type: Number, required: true })
	tgId: number;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
