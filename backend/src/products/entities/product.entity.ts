import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "src/users/entities/user.entity";

export type ProductDocument = HydratedDocument<Product>

export enum ProductStatus {
    AVAILABLE = 'AVAILABLE',
    SOLD_OUT = 'SOLD OUT'
}

@Schema()
export class Product {

    @Prop({ default: () => crypto.randomUUID() })
    _id: string;

    // Terminar depois que fizer usuario
    @Prop({ type: String, ref: User.name })
    userId: string;

    @Prop({ type: String })
    name: string;

    @Prop({ type: String })
    description?: string;

    @Prop({ type: Number })
    stock: number;

    @Prop({ enum: ProductStatus, required: true})
    productStatus: ProductStatus
}

export const ProductSchema = SchemaFactory.createForClass(Product)