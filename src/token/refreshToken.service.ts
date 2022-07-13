import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import {UserService} from "src/user/user.service";
import {RefreshTokenRepository} from "./refreshToken.repository";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

@Injectable()
export class RefreshTokenService {
	constructor(
		private refreshTokenRepository: RefreshTokenRepository,
		private userService: UserService
	) {}

	async generateAccessToken(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: `15m`,
		});
		const refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
			expiresIn: `30d`,
		});

		return {
			accessToken,
			refreshToken,
		};
	}

	async saveRefreshToken(userId: string, refreshToken: string) {
		const tokenData = await this.refreshTokenRepository.findOne({user: userId});

		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return await tokenData.save();
		}

		const user = await this.userService.getUserById(userId);
		if (!user) return new HttpException(`User not found`, HttpStatus.BAD_REQUEST);

		const token = await this.refreshTokenRepository.create({
			user,
			refreshToken,
		});

		return token;
	}
}
