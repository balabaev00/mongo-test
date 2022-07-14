import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import {UserService} from "src/user/user.service";
import {TokenPayload} from "types";
import {RefreshTokenRepository} from "./refreshToken.repository";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

@Injectable()
export class RefreshTokenService {
	constructor(
		private refreshTokenRepository: RefreshTokenRepository,
		private userService: UserService
	) {}

	/**
	 * It takes a payload, signs it with the access secret, and returns an access token that expires in 15
	 * minutes. It then signs the payload with the refresh secret and returns a refresh token that expires
	 * in 30 days
	 * @param {TokenPayload} payload - The payload that will be used to generate the tokens.
	 * @returns An object with two properties, accessToken and refreshToken.
	 */
	async generateTokens(payload: TokenPayload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: `15m`,
		});
		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
			expiresIn: `30d`,
		});

		return {
			accessToken,
			refreshToken,
		};
	}

	/**
	 * It saves the refresh token to the database
	 * @param {string} userId - The user's ID
	 * @param {string} refreshToken - The refresh token that was generated by the server.
	 * @returns The token is being returned.
	 */
	async saveRefreshToken(userId: string, refreshToken: string) {
		const tokenData = await this.refreshTokenRepository.findOne(userId);

		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return await tokenData.save();
		}

		const user = await this.userService.getUserById(userId);
		if (!user) return new HttpException(`User not found`, HttpStatus.BAD_REQUEST);

		const token = await this.refreshTokenRepository.create(userId, refreshToken);

		return token;
	}

	/**
	 * It deletes a refresh token from the database
	 * @param {string} refreshToken - The refresh token that was sent to the client.
	 * @returns The refresh token is being deleted from the database.
	 */
	async removeToken(refreshToken: string) {
		return await this.refreshTokenRepository.deleteToken(refreshToken);
	}

	/**
	 * It takes a refresh token as an argument, verifies it, and returns the result
	 * @param {string} refreshToken - The refresh token that was sent to the client.
	 * @returns The decoded payload of the refresh token.
	 */
	validateRefreshToken(refreshToken: string) {
		try {
			const result = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
			return result;
		} catch (err) {
			return null;
		}
	}

	/**
	 * It takes an access token, verifies it, and returns the result
	 * @param {string} accessToken - The access token to validate.
	 * @returns The result of the jwt.verify() function.
	 */
	validateAccessToken(accessToken: string) {
		try {
			const result = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
			return result;
		} catch (err) {
			return null;
		}
	}

	async findRefreshToken(refreshToken: string) {
		return await this.refreshTokenRepository.findOneByRefreshToken(refreshToken);
	}

	async findRefreshTokenByUserId(userId: string) {
		return await this.refreshTokenRepository.findOne(userId);
	}
}
