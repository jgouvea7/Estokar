import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
    @Prop({default: () => crypto.randomUUID() })
    _id: string;

    @Prop({ type: String })
    name: string;

    @Prop({ type: String })
    email: string;

    @Prop({ type: String })
    password: string;

    @Prop({ type: Date })
    bornDate: Date
}

export const UserSchema = SchemaFactory.createForClass(User)