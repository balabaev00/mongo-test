import {Body, Controller, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {AuthDto, LoginDto} from "./dto/auth.dto";

@Controller(`auth`)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post(`local/signUp`)
	async signUpLocal(@Body() dto: AuthDto) {
		return await this.authService.signUpLocal(dto);
	}

	@Post(`local/signIn`)
	async signInLocal(@Body() dto: LoginDto) {
		return await this.authService.signInLocal(dto);
	}

	@Post(`logout`)
	async logout() {}

	@Post(`refresh`)
	async refreshToken() {}
}
