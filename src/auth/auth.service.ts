import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UserService} from "../user/user.service";
import {AuthDto, LoginDto} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import {RefreshTokenService} from "../token/refreshToken.service";

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private refreshTokenService: RefreshTokenService
	) {}

	/**
	 * It creates a user, and if the user is created, it returns the tokens
	 * @param {AuthDto} dto - AuthDto - this is the object that will be passed to the method. It will
	 * contain the email and password of the user.
	 * @returns The tokens are being returned.
	 */
	async signUpLocal(dto: AuthDto) {
		const user = await this.userService.createUser(dto.email, dto.password, dto.age);

		if (user === `Email is busy`) return user;

		const tokens = await this.refreshTokenService.generateTokens({
			userId: user.id,
			email: user.email,
		});

		await this.refreshTokenService.saveRefreshToken(user.id, tokens.refreshToken);
		return {
			...tokens,
			user: {
				email: user.email,
			},
		};
	}

	/**
	 * It takes a loginDto, gets the user by email, checks if the password matches, generates tokens,
	 * saves the refresh token, and returns the tokens and user
	 * @param {LoginDto} dto - LoginDto - this is the data transfer object that we will use to pass the
	 * email and password to the server.
	 * @returns {
	 * 		accessToken: string;
	 * 		refreshToken: string;
	 * 		user: {
	 * 			email: string;
	 * 		};
	 * 	}
	 */
	async signInLocal(dto: LoginDto) {
		const user = await this.userService.getUserByEmail(dto.email);

		if (!user) return new HttpException(`User not found`, HttpStatus.BAD_REQUEST);

		const isPasswordMatching = await bcrypt.compare(dto.password, user.password);

		if (!isPasswordMatching)
			return new HttpException(`Password is wrong`, HttpStatus.BAD_REQUEST);

		const tokens = await this.refreshTokenService.generateTokens({
			userId: user.id,
			email: user.email,
		});

		await this.refreshTokenService.saveRefreshToken(user.id, tokens.refreshToken);
		return {
			...tokens,
			user: {
				email: user.email,
			},
		};
	}

	/**
	 * It removes the refresh token from the database
	 * @param {string} refreshToken - The refresh token that was sent to the client.
	 * @returns The token is being returned.
	 */
	async logout(refreshToken: string) {
		const token = await this.refreshTokenService.removeToken(refreshToken);

		return token;
	}

	async refreshToken(refreshToken: string) {
		if (!refreshToken) return `RefreshToken is null`;

		const result = this.refreshTokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await this.refreshTokenService.findRefreshToken(refreshToken);

		if (!tokenFromDb) return `RefreshToken not found`;
		if (typeof result === `string`) return `An error occurred during verification`;

		const user = await this.userService.getUserByEmail(result.email);

		if (!user) return `User not found`;

		const tokens = await this.refreshTokenService.generateTokens({
			userId: user.id,
			email: user.email,
		});

		await this.refreshTokenService.saveRefreshToken(user.id, tokens.refreshToken);
		return {
			...tokens,
			user: {
				email: user.email,
			},
		};
	}
}
