import {Body, Controller, Post, Req, Res} from "@nestjs/common";
import {Response, Request} from "express";
import {AuthService} from "./auth.service";
import {AuthDto, LoginDto} from "./dto/auth.dto";

@Controller(`auth`)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post(`local/signUp`)
	async signUpLocal(
		@Body() dto: AuthDto,
		@Res({passthrough: true}) response: Response
	) {
		const result = await this.authService.signUpLocal(dto);

		if (result === `Email is busy`)
			return {
				error: true,
				status: 400,
				errorMessage: result,
			};

		response.cookie(`refreshToken`, result.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		return {
			error: false,
			status: 201,
			...result,
		};
	}

	@Post(`local/signIn`)
	async signInLocal(@Body() dto: LoginDto) {
		return await this.authService.signInLocal(dto);
	}

	@Post(`logout`)
	async logout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
		const {refreshToken} = request.cookies;

		const result = await this.authService.logout(refreshToken);
		response.clearCookie(`refreshToken`);

		return result;
	}

	@Post(`refresh`)
	async refreshToken() {}
}
