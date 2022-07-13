import {Controller, Post} from "@nestjs/common";
import {AuthService} from "./auth.service";

@Controller(`auth`)
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post(`local/signUp`)
	signUpLocal() {}

	@Post(`local/signIn`)
	signInLocal() {}

	@Post(`logout`)
	logout() {}

	@Post(`refresh`)
	refreshToken() {}
}
