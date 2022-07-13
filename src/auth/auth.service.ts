import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {User} from "src/user/schemas/user.schema";
import {UserService} from "../user/user.service";
import {AuthDto, LoginDto} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
	constructor(private userService: UserService, private jwtService: JwtService) {}

	/**
	 * It creates a JWT token with the user's ID and email as the payload, and the secret key as the
	 * signature
	 * @param {string} userId - The user's id
	 * @param {string} email - The email of the user
	 * @returns A token
	 */
	private async getToken(userId: string, email: string) {
		return await this.jwtService.signAsync(
			{sub: userId, email},
			{expiresIn: 60 * 15, secret: `auth-secret`}
		);
	}

	/**
	 * It creates a user, and if the user is created, it returns the tokens
	 * @param {AuthDto} dto - AuthDto - this is the object that will be passed to the method. It will
	 * contain the email and password of the user.
	 * @returns The tokens are being returned.
	 */
	async signUpLocal(dto: AuthDto) {
		const user = this.userService.createUser(dto.email, dto.password, dto.age);

		if (user instanceof User) {
			const token = await this.getToken(user.id, user.email);

			return token;
		}

		return user;
	}

	async signInLocal(dto: LoginDto) {
		const user = await this.userService.getUserByEmail(dto.email);

		if (!user) return new HttpException(`User not found`, HttpStatus.BAD_REQUEST);

		const isPasswordMatching = await bcrypt.compare(dto.password, user.password);

		if (!isPasswordMatching)
			return new HttpException(`Password is wrong`, HttpStatus.BAD_REQUEST);

		return {
			token: await this.getToken(user.id, user.email),
		};
	}
}
