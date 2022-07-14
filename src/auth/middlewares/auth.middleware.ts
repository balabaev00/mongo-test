import {UserService} from "./../../user/user.service";
import {RefreshTokenService} from "./../../token/refreshToken.service";
import {Injectable, NestMiddleware} from "@nestjs/common";
import {Request, Response, NextFunction} from "express";
import {AuthService} from "../auth.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private refreshTokenService: RefreshTokenService,
		private userService: UserService,
		private authService: AuthService
	) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const authorizationHeader = req.headers.authorization;

		if (!authorizationHeader) {
			req.user = null;
			next();
			return;
		}

		const accessToken = authorizationHeader.split(` `)[1];
		if (!accessToken) {
			req.user = null;
			next();
			return;
		}

		const userData = this.refreshTokenService.validateAccessToken(accessToken);
		if (typeof userData === `string`) {
			req.user = null;
			next();
			return;
		}

		const {refreshToken} = req.cookies;

		const result = await this.authService.refreshToken(refreshToken);

		if (typeof result === `string`) {
			req.user = null;
			next();
			return;
		}

		res.cookie(`refreshToken`, result.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});

		req.user = userData;
		next();
		return;
	}
}
