import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {FilterQuery, Model} from "mongoose";
import {RefreshToken, RefreshTokenDocument} from "./schemas/refreshToken.schema";

@Injectable()
export class RefreshTokenRepository {
	constructor(
		@InjectModel(RefreshToken.name) private refreshModel: Model<RefreshTokenDocument>
	) {}

	/**
	 * Find one refresh token document that matches the given filter query
	 * @param refreshTokenFilterQuery - FilterQuery<RefreshToken>
	 * @returns The refresh token document that matches the filter query.
	 */
	async findOne(refreshTokenFilterQuery: FilterQuery<RefreshToken>) {
		return await this.refreshModel.findOne(refreshTokenFilterQuery);
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
