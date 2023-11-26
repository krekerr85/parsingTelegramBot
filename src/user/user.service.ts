import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/models/Admin.model';
import { User } from 'src/models/User.model';


@Injectable()
export class UserService {
	constructor(
		@InjectModel('user') private userModel: Model<User>,
		@InjectModel('admin') private adminModel: Model<Admin>
	) {}

	async findOne(tgId: number): Promise<User> {
		return this.userModel.findOne({ tgId }).exec();
	}

	async create(user: {
		tgId: number;
		username: string;
		lastActivity: Date;
	}): Promise<User> {
		const createdUser = new this.userModel(user);
		return createdUser.save();
	}

	async update(tgId: number): Promise<User> {
		const date = new Date();
		return this.userModel
			.findOneAndUpdate(
				{ tgId },
				{
					lastActivity: date
				}
			)
			.exec();
	}

	async findById(userId: string): Promise<User | null> {
		const user = await this.userModel.findById(userId).exec();
		return user;
	}

	async isAdmin(tgId: number): Promise<boolean> {
		const admin = await this.adminModel.findOne({ tgId }).exec();
		return !!admin;
	}
}
