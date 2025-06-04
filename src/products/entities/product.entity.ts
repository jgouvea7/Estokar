import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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
    @Prop({ type: String, ref: 'User'})
    userId: string;

    @Prop({ type: String })
    name: string;

    @Prop({ type: String })
    description?: string;

    @Prop({ type: Number })
    stock: number;

    @Prop()
    productStatus: ProductStatus
}

export const ProductSchema = SchemaFactory.createForClass(Product)