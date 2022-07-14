import {RefreshTokenModule} from "src/token/refreshToken.module";
import {AuthMiddleware} from "./../auth/middlewares/auth.middleware";
import {MiddlewareConsumer, Module, RequestMethod} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {env} from "process";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(
			`mongodb://${env.MONGO_ROOT_USER}:${env.MONGO_ROOT_PASSWORD}@${env.MONGO_DB_HOST}:${env.MONGO_DB_PORT}/${env.MONGO_DB_NAME}`
		),
		AuthModule,
		UserModule,
		RefreshTokenModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({
			path: "*",
			method: RequestMethod.ALL,
		});
	}
}
