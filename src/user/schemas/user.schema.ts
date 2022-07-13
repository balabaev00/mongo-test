import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop()
	id: string;

	@Prop()
	email: string;

	@Prop()
	password: string;

	@Prop()
	age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
