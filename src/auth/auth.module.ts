import {Module} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {UserModule} from "../user/user.module";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
@Module({
	imports: [UserModule],
	providers: [AuthService, JwtService],
	controllers: [AuthController],
})
export class AuthModule {}
