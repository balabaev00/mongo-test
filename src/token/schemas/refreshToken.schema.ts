import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {User} from "../../user/schemas/user.schema";

export type RefreshTokenDocument = RefreshToken & Document;

@Schema()
export class RefreshToken {
	@Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
	user: User;

	@Prop()
	refreshToken: string;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
