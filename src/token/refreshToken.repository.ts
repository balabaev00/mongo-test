import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import mongoose, {FilterQuery, Model, Types} from "mongoose";
import {RefreshToken, RefreshTokenDocument} from "./schemas/refreshToken.schema";

@Injectable()
export class RefreshTokenRepository {
	constructor(
		@InjectModel(RefreshToken.name) private refreshModel: Model<RefreshTokenDocument>
	) {}

	/**
	 * It finds a single record in the database that matches the userId passed in
	 * @param {string} userId - The user's ID.
	 * @returns A refresh token record.
	 */
	async findOne(userId: string) {
		return await this.refreshModel.findOne({user: userId});
	}

	/**
	 * It creates a new refresh token and saves it to the database
	 * @param {RefreshToken} refreshToken - The refresh token to be saved.
	 * @returns The new refresh token is being returned.
	 */
	async create(refreshToken: RefreshToken) {
		const newRefreshToken = new this.refreshModel(refreshToken);
		return await newRefreshToken.save();
	}
}
