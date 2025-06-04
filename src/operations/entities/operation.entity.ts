import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";

export type OperationDocument = HydratedDocument<Operation>

export enum OperationType {
    SELL = 'SELL',
    BROKEN = 'BROKEN',
}

@Schema({ timestamps: true })
export class Operation {
    @Prop({ default: () => crypto.randomUUID()})
    _id: string;

    @Prop({ type: String, ref: User.name })
    userId: string;

    @Prop({ type: String, ref: Product.name })
    productId: string;

    @Prop({ type: Number })
    quantity: number;

    @Prop()
    typeOperation: OperationType
}

export const OperationSchema = SchemaFactory.createForClass(Operation)