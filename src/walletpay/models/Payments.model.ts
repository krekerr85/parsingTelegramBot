import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Payments extends Document {
	@Prop({ required: true, type: String })
	externalId: string;

	@Prop({ required: true, type: String })
	userId: number;

	@Prop({ required: true, type: Date, default: Date.now })
	createdAt: Date;

	@Prop({ type: Date })
	purchaseDate: Date;

	@Prop({
		required: true,
		enum: ['pending', 'success', 'canceled'],
		default: 'pending'
	})
	status: string;

	@Prop({ required: true, type: Number })
	tonCost: number;

	@Prop({ required: true, type: Number })
	dollarCost: number;

  @Prop({ required: true, type: String })
	paymentLink: string;
  
}

export const PaymentsSchema = SchemaFactory.createForClass(Payments);
