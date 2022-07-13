import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {RefreshTokenRepository} from "./refreshToken.repository";
import {RefreshTokenService} from "./refreshToken.service";
import {RefreshToken, RefreshTokenSchema} from "./schemas/refreshToken.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{name: RefreshToken.name, schema: RefreshTokenSchema},
		]),
	],
	providers: [RefreshTokenService, RefreshTokenRepository],
})
export class TokenModule {}
