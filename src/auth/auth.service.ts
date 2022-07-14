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

		if (user === `Email is busy`)
			return new HttpException(user, HttpStatus.BAD_REQUEST);

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

	async signInLocal(dto: LoginDto) {
		const user = await this.userService.getUserByEmail(dto.email);

		if (!user) return new HttpException(`User not found`, HttpStatus.BAD_REQUEST);

		const isPasswordMatching = await bcrypt.compare(dto.password, user.password);

		if (!isPasswordMatching)
			return new HttpException(`Password is wrong`, HttpStatus.BAD_REQUEST);

		// return {
		// 	token: await this.getToken(user.id, user.email),
		// };
	}
}
