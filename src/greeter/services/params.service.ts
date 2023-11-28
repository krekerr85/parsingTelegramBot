import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Params } from 'src/models/Params.model';

@Injectable()
export class ParamsService {
	constructor(
		@InjectModel('params')
		private readonly paramsModel: Model<Params>
	) {
		this.updateParams({});
	}

	async getParams(): Promise<Params> {
		return this.paramsModel.findOne();
	}
	async updateParams(newParams: Partial<Params>): Promise<Params> {
		const params = await this.paramsModel.findOneAndUpdate({}, newParams, {
			upsert: true,
			new: true
		});
		return params;
	}
}
