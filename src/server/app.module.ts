import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {env} from "process";
import {AuthModule} from "src/auth/auth.module";
import {UserModule} from "src/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(
			`mongodb://${env.MONGO_ROOT_USER}:${env.MONGO_ROOT_PASSWORD}@${env.MONGO_DB_HOST}:${env.MONGO_DB_PORT}/${env.MONGO_DB_NAME}`
		),
		AuthModule,
		UserModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
