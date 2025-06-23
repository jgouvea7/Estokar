import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type PasswordResetDocument = HydratedDocument<PasswordReset>

@Schema()
export class PasswordReset {
    
    @Prop()
    token: string;

    @Prop()
    userId: string;

    @Prop({ required: true, expires: 3600 })
    expires: Date;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset)