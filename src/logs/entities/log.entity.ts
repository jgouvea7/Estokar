import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Operation } from "src/operations/entities/operation.entity";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

export type LogDocument = HydratedDocument<Log>

export enum TypeLog {
    OPERATION = 'OPERATION',
    UPDATE =  'UPDATE',
    CREATE = 'CREATE',
    UPDATESTOCK = 'UPDATE_STOCK',
    DELETE = 'DELETE',
}

@Schema({ timestamps: true })
export class Log {
    @Prop({ default: () => crypto.randomUUID() })
    _id: string;

    @Prop({ type: String, ref: Operation.name })
    operationId: string;

    @Prop({ type: String, ref: User.name })
    userId: string;

    @Prop({ type: String, ref: Product.name})
    productId

    @Prop({ type: Number })
    stockBefore: number;

    @Prop({ type: Number })
    stockAfter: number;

    @Prop({ enum: TypeLog, required: true })
    typeLog: TypeLog
    
    @Prop({ type: Object, default: {} })
    extraInfo?: Record<string, any>;
}

export const LogSchema = SchemaFactory.createForClass(Log)